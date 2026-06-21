function analyzeFood() {
    let weight = document.getElementById("weight").value;

    if (!weight) {
        alert("Please enter food weight");
        return;
    }

    // Dummy data for now (we will replace with AI later)
    document.getElementById("foodName").innerText = "Chicken Rice";
    document.getElementById("calories").innerText = weight * 2.5;
    document.getElementById("protein").innerText = weight * 0.1;
    document.getElementById("carbs").innerText = weight * 0.3;
    document.getElementById("fat").innerText = weight * 0.05;
}
