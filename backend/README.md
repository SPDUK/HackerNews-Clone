Install deps with `yarn`, then create the variables.env file and add secrets with:

```
touch variables.env && echo "
FRONTEND_URL="http://localhost:7777"
PRISMA_ENDPOINT="Prisma host URL"
PRISMA_SECRET="Some prisma secret" # comment out this line during development
APP_SECRET="Some random string for JWT auth"
PORT=4444
" >> variables.env
```

Change the secrets in `variables.env` to valid information.

After changing the `datamodel.prisma` run `yarn deploy` which will update the generated schema in `src/generated` using variables.env settings.

Run the server `yarn start`

Run the server in dev mode with `yarn dev`, which will watch .js and .graphql files for changes
