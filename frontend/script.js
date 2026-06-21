async function detectFood(imageFile) {

    let formData = new FormData();
    formData.append("file", imageFile);

    let response = await fetch(
        "YOUR_API_URL_HERE?api_key=YOUR_API_KEY_HERE",
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
