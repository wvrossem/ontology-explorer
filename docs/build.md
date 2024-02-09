# Build and deploy

To prepare Ontology Explorer application for publishing a website, you’ll need to follow these steps:

## 1. Run the build command

Open your terminal or command prompt and navigate to the root directory where you installed the project.

To build your application for production, execute the following command:

```bash
npm run build
```

This command will start the build process and generate optimized production-ready assets in the dist directory.

## 2. Deployment

Once the build process completes successfully, you can deploy the application to your hosting environment. Upload _the contents of the dist directory_ to your web server.

For instance, with the demo instance, the contents of the `dist` directory were deployed into a specific directory on the Processing Citizenship web server, accessible at <https://processingcitizenship.eu/ontology-explorer/>.

After deployment, you can verify that the application is running as expected on your server. Visit your deployed website URL and perform thorough testing to ensure everything works correctly.
