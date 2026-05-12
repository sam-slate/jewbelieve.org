# #brownsquarecampaign — site

## Running locally

From inside the `brown-square-site` folder:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000 in your browser.

(If you only have Python 2: `python -m SimpleHTTPServer 8000`)

To stop the server: `Ctrl + C`

## Adding the rest of the billboard images

Drop the seven billboards into `./images/` using exactly these filenames.
The slideshow will pick them up automatically — no code changes needed.

| Save as (in images/)                       | Original file                                                          |
|--------------------------------------------|------------------------------------------------------------------------|
| `billboard-butts.png`                      | can a billboard end but jews have butts - jewbelieve.png               |
| `billboard-cultural-jews.png`              | cultural jews died in the gas chambers too - jewbelieve.png            |
| `billboard-propaganda.png`                 | don't fall for the propaganda - jewbelieve.png                         |
| `billboard-show-butt.png`                  | I'll even show you my butt right now - jewbelieve.png                  |
| `billboard-protesting-israel.png`          | protesting israel but being silent about butts - jewbelieve.png        |
| `billboard-nazis-claimed.png`              | the nazis claimed jew didn't have butts - jew believe.png              |
| `billboard-dont-have-to-be-jew.png`        | you don't have to be a jew to know that jews have butts - jewbelieve.png |

## Cropping notes

The hero uses `background-size: cover`, so any aspect ratio will work — but
for the cleanest result, crop each image to roughly **16:9** (e.g. 1920×1080)
centered on the billboard itself. That keeps the headline text visible and
the framing consistent across the slideshow.

## Tweaking

- **Slideshow speed:** change `SLIDE_DURATION` in `script.js` (default 5000ms).
- **Slide order:** rearrange the `SLIDES` array in `script.js`.
- **Colors:** edit the CSS variables at the top of `styles.css`.
- **Store link:** update the `href` on `.store__cta` in `index.html`.
