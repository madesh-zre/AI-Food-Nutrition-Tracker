// ===== IMAGE PREVIEW =====
function previewImage(event) {
    let image = document.getElementById("preview");
    image.src = URL.createObjectURL(event.target.files[0]);
    image.style.display = "block";
}

// ===== AI DETECTION =====
async function detectFood(imageFile) {

    let formData = new FormData();
    formData.append("file", imageFile);

    let response = await fetch(
        "https://detect.roboflow.com/food-detection-7xta0/1?api_key=CyE2AMcxyYOS3XmFIpov",
        {
            method: "POST",
            body: formData
        }
    );

    let data = await response.json();

    return data?.predictions?.[0]?.class || "unknown";
}

// ===== SAVE =====
function saveMeal(foodName, weight, calories, protein, carbs, fat) {

    let meals = JSON.parse(localStorage.getItem("meals")) || [];

    meals.push({
        foodName,
        weight,
        calories,
        protein,
        carbs,
        fat,
        time: new Date().toLocaleString()
    });

    localStorage.setItem("meals", JSON.stringify(meals));
}

// ===== LOAD =====
function loadMeals() {

    let meals = JSON.parse(localStorage.getItem("meals")) || [];
    let list = document.getElementById("mealList");

    let totalCal = 0, totalPro = 0, totalCarb = 0, totalFat = 0;

    list.innerHTML = "";

    meals.forEach(m => {

        let li = document.createElement("li");
        li.innerText = `${m.foodName} - ${m.weight}g | ${m.calories.toFixed(1)} kcal`;

        list.appendChild(li);

        totalCal += m.calories;
        totalPro += m.protein;
        totalCarb += m.carbs;
        totalFat += m.fat;
    });

    document.getElementById("totalCalories").innerText = totalCal.toFixed(1);
    document.getElementById("totalProtein").innerText = totalPro.toFixed(1);
    document.getElementById("totalCarbs").innerText = totalCarb.toFixed(1);
    document.getElementById("totalFat").innerText = totalFat.toFixed(1);
}

// ===== MAIN =====
async function analyzeFood() {

    let fileInput = document.getElementById("foodImage");
    let weight = parseFloat(document.getElementById("weight").value);

    if (!fileInput.files[0]) {
        alert("Upload image");
        return;
    }

    if (!weight) {
        alert("Enter weight");
        return;
    }

    let foodName = await detectFood(fileInput.files[0]);

    let db = {
        pizza: { cal: 2.8, protein: 0.11, carbs: 0.33, fat: 0.10 },
        burger: { cal: 2.5, protein: 0.12, carbs: 0.30, fat: 0.15 },
        rice: { cal: 1.3, protein: 0.03, carbs: 0.28, fat: 0.01 }
    };

    let food = db[foodName.toLowerCase()] || db["rice"];

    let calories = food.cal * weight;
    let protein = food.protein * weight;
    let carbs = food.carbs * weight;
    let fat = food.fat * weight;

    document.getElementById("foodName").innerText = foodName;
    document.getElementById("calories").innerText = calories.toFixed(1);
    document.getElementById("protein").innerText = protein.toFixed(1);
    document.getElementById("carbs").innerText = carbs.toFixed(1);
    document.getElementById("fat").innerText = fat.toFixed(1);

    saveMeal(foodName, weight, calories, protein, carbs, fat);
    loadMeals();
}

// ===== CLEAR =====
function clearMeals() {
    localStorage.removeItem("meals");
    loadMeals();
}

// ===== INIT =====
loadMeals();
