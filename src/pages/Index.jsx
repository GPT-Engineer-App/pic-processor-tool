import { Container, Text, VStack, Box, Input, Button, Image } from "@chakra-ui/react";
import { useState } from "react";

const Index = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(file);
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageDownload = () => {
    if (previewUrl) {
      const link = document.createElement("a");
      link.href = previewUrl;
      link.download = "edited-image.png";
      link.click();
    }
  };

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <VStack spacing={4}>
        <Text fontSize="2xl">Image Upload, Edit, and Download Tool</Text>
        <Input type="file" accept="image/*" onChange={handleImageUpload} />
        {previewUrl && (
          <Box>
            <Image src={previewUrl} alt="Selected" maxH="300px" />
            <Button mt={2} onClick={handleImageDownload}>Download Image</Button>
          </Box>
        )}
      </VStack>
    </Container>
  );
};

export default Index;