This extension has the potential to be very unique in the Firefox ecosystem, as Chrome is transitioning to manifest v3. It uses the embedded model from OpenAI to intelligently filter entertainment websites in order to reduce or even prevent reflexive consumption.

This is just a rough MVP (minimum viable product) and I am publishing it to get feedback from some colleagues. I want to make it easier for them to get started with the extension.

I am using React for the popup. To run the extension, you need to use the following commands: "yarn", "yarn build". Then, drag the html file from the "dist" directory into the top level directory and delete the "crossorigin" attribute on the js script tag. Finally, move the "assets" folder from the "dist" directory into the top level directory as well.

