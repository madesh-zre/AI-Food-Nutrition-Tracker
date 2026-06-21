async function detectFood(imageFile) {

    let formData = new FormData();
    formData.append("file", imageFile);

    let response = await fetch(
        "https://universe.roboflow.com/food-segementation/food-detection-7xta0?api_key=CyE2AMcxyYOS3XmFIpov",
        {
            method: "POST",
            body: formData
        }
    );

    let data = await response.json();

    console.log("AI RESPONSE:", data);

    let foodName = data?.predictions?.[0]?.class || "unknown";

    return foodName;
}
