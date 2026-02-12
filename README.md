# Non-Breastmilk Feeding Risk Assessment Web App

This app estimates probability of non-breastmilk feeding using the reduced multivariable logistic regression model from `analysis_log.txt`.

## Model used

Logit equation:

`logit(p) = 1.0219 - 0.7448*(Employment_1) - 0.4517*(Employment_2) - 0.3314*(Residence_2) - 1.2665*(Parity_2) - 0.5030*(Parity_3) - 0.6274*(BirthWt_2) - 1.2647*(BF_Initiation_1)`

`p = 1 / (1 + e^(-logit(p)))`

Reference categories:
- Employment: Unemployed
- Residence: Rural
- Parity: Primi
- Birth weight: 1.5-2.5 kg (LBW)
- BF initiation: >1 hour (Delayed)

## Run locally

Open `index.html` directly, or run:

```powershell
cd risk-assessment-app
python -m http.server 8080
```

Then visit `http://localhost:8080`.

## Publish through GitHub + Netlify

1. Initialize and commit:
```powershell
git init
git add .
git commit -m "Add risk assessment web app"
```
2. Create a new GitHub repo and push:
```powershell
git branch -M main
git remote add origin https://github.com/<your-user>/<your-repo>.git
git push -u origin main
```
3. In Netlify:
- Add new site from Git.
- Choose your GitHub repo.
- Build command: leave empty.
- Publish directory: `risk-assessment-app`.
- Deploy.

Optional Netlify CLI deploy:

```powershell
npm i -g netlify-cli
netlify login
netlify init
netlify deploy --prod --dir=risk-assessment-app
```
