from pathlib import Path
import contourpy
import numpy as np
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'asset/logo/logo.png'
OUTPUT_DIR = SOURCE.parent
INK = (23, 43, 67)
LIGHT_INK = (233, 243, 255)
BLUE = (57, 123, 233)


def get_mark_mask(image: np.ndarray) -> tuple[np.ndarray, np.ndarray]:
    rgb = image[:, :, :3]
    brightness = rgb.max(axis=2)
    foreground = brightness > 9
    rows, columns = np.where(foreground)
    x, y = columns.min(), rows.min()
    width, height = columns.max() - x + 1, rows.max() - y + 1
    cropped_mask = foreground[y:y + height, x:x + width]

    # Preserve soft edges from the black-matted original without leaving a dark halo.
    alpha = np.clip((brightness[y:y + height, x:x + width].astype(np.float32) - 7) * 9, 0, 255).astype(np.uint8)
    alpha[cropped_mask == 0] = 0
    return cropped_mask, alpha


def make_logo(alpha: np.ndarray, color: tuple[int, int, int]) -> Image.Image:
    canvas = np.zeros((alpha.shape[0], alpha.shape[1], 4), dtype=np.uint8)
    canvas[:, :, :3] = color
    canvas[:, :, 3] = alpha
    return Image.fromarray(canvas, 'RGBA')


def perpendicular_distance(point: np.ndarray, start: np.ndarray, end: np.ndarray) -> float:
    segment = end - start
    if np.allclose(segment, 0):
        return float(np.linalg.norm(point - start))
    return float(abs(np.cross(segment, point - start)) / np.linalg.norm(segment))


def simplify(points: np.ndarray, tolerance: float = 0.8) -> np.ndarray:
    if len(points) < 3:
        return points
    distances = np.array([perpendicular_distance(point, points[0], points[-1]) for point in points[1:-1]])
    if len(distances) == 0 or distances.max() <= tolerance:
        return np.array([points[0], points[-1]])
    index = int(distances.argmax()) + 1
    return np.vstack((simplify(points[:index + 1], tolerance)[:-1], simplify(points[index:], tolerance)))


def paths_for_mask(mask: np.ndarray) -> str:
    generator = contourpy.contour_generator(z=mask.astype(float), name='serial')
    paths: list[str] = []
    for contour in generator.lines(0.5):
        simplified = simplify(contour)
        if len(simplified) < 3:
            continue
        commands = [f'M {simplified[0][0]:.1f} {simplified[0][1]:.1f}']
        commands.extend(f'L {point[0]:.1f} {point[1]:.1f}' for point in simplified[1:])
        commands.append('Z')
        paths.append(' '.join(commands))
    return ' '.join(paths)


def make_svg(mark_mask: np.ndarray, dot_mask: np.ndarray, width: int, height: int, ink: str) -> str:
    text_mask = mark_mask.copy()
    text_mask[dot_mask > 0] = 0
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" role="img" aria-labelledby="title">
  <title>Chaowen logo</title>
  <path fill="{ink}" fill-rule="evenodd" d="{paths_for_mask(text_mask)}"/>
  <path fill="#397be9" fill-rule="evenodd" d="{paths_for_mask(dot_mask)}"/>
</svg>\n'''


def main() -> None:
    image = np.asarray(Image.open(SOURCE).convert('RGBA'))
    mask, alpha = get_mark_mask(image)

    # Keep the blue terminal dot as a separate brand accent in raster exports.
    dot_mask = (
        (image[:, :, 2] > 140)
        & (image[:, :, 2] > image[:, :, 0] * 1.25)
        & (image[:, :, 2] > image[:, :, 1] * 1.08)
    )
    rows, columns = np.where(image[:, :, :3].max(axis=2) > 9)
    x, y = columns.min(), rows.min()
    crop_width, crop_height = columns.max() - x + 1, rows.max() - y + 1
    cropped_dot = dot_mask[y:y + crop_height, x:x + crop_width]

    for filename, ink in [('logo-light.png', INK), ('logo-dark.png', LIGHT_INK)]:
        logo = make_logo(alpha, ink)
        pixels = np.asarray(logo).copy()
        pixels[cropped_dot, :3] = BLUE
        logo = Image.fromarray(pixels, 'RGBA')
        logo.save(OUTPUT_DIR / filename, optimize=True)

        background = (255, 255, 255, 255) if filename == 'logo-light.png' else (23, 43, 67, 255)
        preview = Image.new('RGBA', logo.size, background)
        preview.alpha_composite(logo)
        preview.save(OUTPUT_DIR / filename.replace('.png', '-preview.png'), optimize=True)

    light_svg = make_svg(mask, cropped_dot, crop_width, crop_height, '#172b43')
    dark_svg = make_svg(mask, cropped_dot, crop_width, crop_height, '#e9f3ff')
    (OUTPUT_DIR / 'logo.svg').write_text(light_svg, encoding='utf-8')
    (OUTPUT_DIR / 'logo-light.svg').write_text(light_svg, encoding='utf-8')
    (OUTPUT_DIR / 'logo-dark.svg').write_text(dark_svg, encoding='utf-8')


if __name__ == '__main__':
    main()
