// ===================== AI FOOD DETECTION =====================

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

    console.log("AI RESPONSE:", data);

    let foodName = data?.predictions?.[0]?.class || "unknown";

    return foodName;
}

// ===================== SAVE MEAL =====================

function saveMeal(foodName, weight, calories, protein, carbs, fat) {

    let meals = JSON.parse(localStorage.getItem("meals")) || [];

    let meal = {
        foodName,
        weight,
        calories,
        protein,
        carbs,
        fat,
        time: new Date().toLocaleString()
    };

    meals.push(meal);

    localStorage.setItem("meals", JSON.stringify(meals));
}

// ===================== LOAD MEALS =====================

function loadMeals() {

    let meals = JSON.parse(localStorage.getItem("meals")) || [];

    let mealList = document.getElementById("mealList");

    let totalCal = 0;
    let totalPro = 0;
    let totalCarb = 0;
    let totalFat = 0;

    mealList.innerHTML = "";

    meals.forEach(meal => {

        let li = document.createElement("li");

        li.innerHTML = `
        🍽 ${meal.foodName} - ${meal.weight}g
        | 🔥 ${meal.calories.toFixed(1)} kcal
        `;

        mealList.appendChild(li);

        totalCal += meal.calories;
        totalPro += meal.protein;
        totalCarb += meal.carbs;
        totalFat += meal.fat;
    });

    document.getElementById("totalCalories").innerText = totalCal.toFixed(1);
    document.getElementById("totalProtein").innerText = totalPro.toFixed(1);
    document.getElementById("totalCarbs").innerText = totalCarb.toFixed(1);
    document.getElementById("totalFat").innerText = totalFat.toFixed(1);
}

// ===================== IMAGE PREVIEW =====================

function previewImage(event) {
    let image = document.getElementById("preview");
    image.src = URL.createObjectURL(event.target.files[0]);
    image.style.display = "block";
}

// ===================== MAIN FUNCTION =====================

async function analyzeFood() {

    let fileInput = document.getElementById("foodImage");
    let weight = document.getElementById("weight").value;

    if (!fileInput.files[0]) {
        alert("Please upload an image");
        return;
    }

    if (!weight) {
        alert("Please enter weight");
        return;
    }

    let foodName = await detectFood(fileInput.files[0]);

    // simple nutrition database
    let nutritionDB = {
        pizza: { cal: 2.8, protein: 0.11, carbs: 0.33, fat: 0.10 },
        burger: { cal: 2.5, protein: 0.12, carbs: 0.30, fat: 0.15 },
        rice: { cal: 1.3, protein: 0.03, carbs: 0.28, fat: 0.01 }
    };

    let food = nutritionDB[foodName.toLowerCase()] || nutritionDB["rice"];

    let calories = food.cal * weight;
    let protein = food.protein * weight;
    let carbs = food.carbs * weight;
    let fat = food.fat * weight;

    document.getElementById("foodName").innerText = foodName;
    document.getElementById("calories").innerText = calories.toFixed(2);
    document.getElementById("protein").innerText = protein.toFixed(2);
    document.getElementById("carbs").innerText = carbs.toFixed(2);
    document.getElementById("fat").innerText = fat.toFixed(2);

    // SAVE + UPDATE HISTORY (STEP 4 INCLUDED HERE)
    saveMeal(foodName, weight, calories, protein, carbs, fat);
    loadMeals();
}

// ===================== AUTO LOAD =====================

loadMeals();
