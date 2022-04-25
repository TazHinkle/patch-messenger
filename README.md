# Patch Messenger

## Running locally

- `yarn` to install all dependencies
- copy `server/.env.example` to `server/.env` and replace each value appropriately
- turn on the api with `yarn run api`
- turn on the client with `yarn run web_serve`
- visit http://localhost:8080

## Running with Docker/AWS

To build into a runnable docker image, run `build_image.sh`

To deploy the image to AWS, run `deploy_image_to_aws.sh`

This container will need 4 Environment Variables to be able to run:
- `TWILIO_ACCOUNT_SID` 
- `TWILIO_AUTH_TOKEN`
- `TWILIO_PHONE_OUT` Twilio phone number you are sending from
- `SIMPLE_PASSWORD`
