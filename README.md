# Patch Messenger

## Running locally

- run `yarn run api`
- run `your run web_serve`

## Running with Docker/AWS

To build into a runnable docker image, run `build_image.sh`

To deploy the image to AWS, run `deploy_image_to_aws.sh`

This container will need 4 Environment Variables to be able to run:
- `TWILIO_ACCOUNT_SID` 
- `TWILIO_AUTH_TOKEN`
- `TWILIO_PHONE_OUT` Twilio phone number you are sending from
- `SIMPLE_PASSWORD`
