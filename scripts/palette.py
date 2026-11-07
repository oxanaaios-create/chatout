"""Extract a palette from images: k-means, hex + share of area.

Usage: python3 scripts/palette.py assets/imagery/*.jpg [-k 8]
Needs: pip install pillow numpy
"""
import argparse

import numpy as np
from PIL import Image


def kmeans(pixels, k, iters=20, seed=0):
    rng = np.random.default_rng(seed)
    centers = pixels[rng.choice(len(pixels), k, replace=False)]
    for _ in range(iters):
        labels = np.argmin(((pixels[:, None] - centers[None]) ** 2).sum(-1), axis=1)
        new = np.array([pixels[labels == i].mean(0) if (labels == i).any() else centers[i] for i in range(k)])
        if np.allclose(new, centers):
            break
        centers = new
    return centers, labels


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("images", nargs="+")
    ap.add_argument("-k", type=int, default=8)
    a = ap.parse_args()
    for path in a.images:
        img = Image.open(path).convert("RGB")
        img.thumbnail((200, 200))
        px = np.asarray(img, dtype=float).reshape(-1, 3)
        centers, labels = kmeans(px, min(a.k, len(px)))
        share = np.bincount(labels, minlength=len(centers)) / len(labels)
        print(path)
        for i in np.argsort(-share):
            r, g, b = centers[i].round().astype(int)
            print(f"  #{r:02X}{g:02X}{b:02X}  {share[i] * 100:5.1f}%")


if __name__ == "__main__":
    main()
