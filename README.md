# Patch Messenger

## Building the image

To build into a runnable docker image, run `build_image.sh`

To deploy the image to AWS, run `deploy_image_to_aws.sh`

This container will need 3 Environment Variables to be able to run:
- `TWILIO_ACCOUNT_SID` 
- `TWILIO_AUTH_TOKEN`
- `TWILIO_PHONE_OUT` Twilio phone number you are sending from