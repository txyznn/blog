from pathlib import Path

from PIL import Image, ImageDraw


SIZE = 512
ROOT = Path(__file__).resolve().parents[1]
output = ROOT / 'src/asset/favicon/favicon.png'

image = Image.new('RGBA', (SIZE, SIZE), (23, 43, 67, 255))
draw = ImageDraw.Draw(image)
draw.rounded_rectangle((18, 18, 494, 494), radius=102, outline=(57, 123, 233, 77), width=4)
draw.arc((101, 101, 411, 411), start=42, end=318, fill=(237, 245, 255, 255), width=58)
draw.ellipse((337, 336, 405, 404), fill=(57, 123, 233, 255))
image.save(output, optimize=True)
