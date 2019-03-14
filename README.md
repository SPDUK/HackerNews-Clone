# HackerNews-Clone

## Deploying

#

### Prisma:

Create the DB using prisma UI (click severs and add new server).

Make sure the secrets are set up.

run `npm run deploy -- -n` if the DB isn't created yet and choose the recently created one, otherwise `npm run deploy`.

#

### Yoga backend:

**With Heroku**:
Create a heroku app `heroku apps:create hackernews-clone-prod`

Add the remote git URL just for backend `git remote add heroku-backend [URL]` and replace `[URL]` with the correct one

Push up just the backend subfolder with `git subtree push --prefix backend heroku-backend master` while in the main project folder, --prefix backend means push the backend folder, heroku-backend is the remote we just created and master is the branch.

Open the app on heroku, and fill out the config vars.

Remember to:

- change `FRONTEND_URL` to the react production URL
- change `PRISMA_ENDPOINT` to the Prisma app hosted on heroku.

**With Now**:
_(this is public, the code is visible to anyone who visits the URL)_

change the info in `variables.env` to production variables, or create `production.env`

install the now CLI `npm i now -g`

Go into `/backend` and simply run `now --dotenv=variables.env`.
