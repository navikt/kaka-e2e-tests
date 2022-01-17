# KAKA E2E tests
This app uses [Playwright](https://playwright.dev/) to log in as a test user in development and test that the app behaves as expected.

## Running the tests
`npm test`

The app depends on a few environment variables to send messages to Slack.
Without these it will output the same message updates to the console, it will be repeated a lot.

The test user is also retrieved from the environment.

### Local
Locally the E2E application will not send messages to Slack. The Slack config is therefore not needed.

```
export SAKSBEHANDLER_USERNAME=<email>
export SAKSBEHANDLER_PASSWORD=<password>
```

### GCP
```
kubectl create configmap slack-e2e-configmap \
--from-literal=kaka_notifications_channel=klage-notifications

kubectl create secret generic slack-e2e-secrets \
--from-literal=slack_e2e_token=<token> \
--from-literal=slack_signing_secret=<secret>

kubectl create secret generic kaka-e2e-test-users \
--from-literal=SAKSBEHANDLER_USERNAME=<email> \
--from=literal=SAKSBEHANDLER_PASSWORD=<password>
```

As a one-time job, before the tests can run, we must apply the networkpolicy (nais/networkpolicy.yaml)
```
kubectl apply -f networkpolicy.yaml -n klage
```
