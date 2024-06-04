Certainly! Here's a developer-friendly step-by-step guide using only the commands mentioned in the provided paragraph.

### Step-by-Step Guide

1. **Build the Docker Image**

   Open your terminal and navigate to the directory containing your Dockerfile and Lambda function code. Then, run the following command to build the Docker image and tag it as "whisper":

   ```bash
   docker build -t whisper .
   ```

   This command uses the Dockerfile in the current directory (`.`) to build the image and tags it with the name "whisper". Note that building the image might take some time.

2. **Run the Docker Image Locally for Testing**

   After the image is built, you can run it locally to test if it works correctly. Use the following command to run the Docker container:

   ```bash
   docker run -p 9000:8080 whisper
   ```

   This command runs the Docker container and maps port 8080 inside the container to port 9000 on your local machine.

3. **Test the Docker Image Locally**

   With the Docker container running, you can test the Lambda function by sending a POST request to the local endpoint. Open another terminal window and run:

   ```bash
   curl -XPOST "http://localhost:9000/2015-03-31/functions/function/invocations" -d '{}'
   ```

   This command sends a POST request to invoke the Lambda function, which should return the response from your function.

4. **Push the Docker Image to Amazon ECR**

   After verifying that the Docker image works as expected, you can push it to Amazon ECR. First, authenticate Docker to your Amazon ECR registry:

   ```bash
   aws ecr get-login-password --region your-region | docker login --username AWS --password-stdin your-account-id.dkr.ecr.your-region.amazonaws.com
   ```

   Replace `your-region` with your AWS region and `your-account-id` with your AWS account ID.

5. **Tag the Docker Image**

   Tag the Docker image with your ECR repository URI:

   ```bash
   docker tag whisper your-account-id.dkr.ecr.your-region.amazonaws.com/whisper
   ```

   Replace `your-account-id` and `your-region` with your AWS account ID and region, respectively.

6. **Push the Docker Image to ECR**

   Push the Docker image to your ECR repository:

   ```bash
   docker push your-account-id.dkr.ecr.your-region.amazonaws.com/whisper
   ```

   This command uploads your Docker image to the specified ECR repository.

7. **Deploy the Docker Image to AWS Lambda**

   Finally, you can create or update your Lambda function to use the Docker image stored in ECR. You can do this through the AWS Management Console, AWS CLI, or AWS SDKs. Here’s an example using the AWS CLI:

   ```bash
   aws lambda create-function --function-name my-lambda-function \
     --package-type Image \
     --code ImageUri=your-account-id.dkr.ecr.your-region.amazonaws.com/whisper:latest \
     --role arn:aws:iam::your-account-id:role/your-lambda-role
   ```

   Replace `your-account-id`, `your-region`, and `your-lambda-role` with your AWS account ID, region, and the IAM role ARN that grants your Lambda function the necessary permissions.

By following these steps, you can build, test, and deploy a Lambda function using a Docker image.