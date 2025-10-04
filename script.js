tailwind.config = {
    theme: {
        extend: {
            fontFamily: { sans: ['Inter', 'sans-serif'] },
            colors: { 'primary-indigo': '#4f46e5', 'secondary-green': '#10b981' }
        }
    }
};

function clearResult() {
    document.getElementById('result-box').classList.remove('show');
    document.getElementById('ai-tips-container').classList.remove('show');
    document.getElementById('bmi-value').textContent = '--';
    const badge = document.getElementById('category-badge');
    badge.textContent = '--';
    badge.className = 'px-3 py-1 text-sm rounded-full shadow-md';
    document.getElementById('age-display').textContent = '--';
    document.getElementById('ai-tips-content').textContent = '';
    document.getElementById('ai-header-text').textContent = 'Health Coach Advice';
    document.getElementById('height-error').classList.add('hidden');
    document.getElementById('weight-error').classList.add('hidden');
    document.getElementById('age-error').classList.add('hidden');
}

function validateInput(id, value, min, max) {
    const errorElement = document.getElementById(`${id}-error`);
    if (isNaN(value) || value < min || value > max) {
        errorElement.classList.remove('hidden');
        return false;
    }
    errorElement.classList.add('hidden');
    return true;
}

function calculateBMI() {
    clearResult();
    const heightCm = parseFloat(document.getElementById('height').value);
    const weightKg = parseFloat(document.getElementById('weight').value);
    const age = parseInt(document.getElementById('age').value);
    let isValid = true;
    if (!validateInput('height', heightCm, 100, 250)) isValid = false;
    if (!validateInput('weight', weightKg, 20, 300)) isValid = false;
    if (!validateInput('age', age, 5, 120)) isValid = false;
    if (!isValid) return;

    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);
    const formattedBmi = bmi.toFixed(1);

    let categoryText = '', categoryClass = '';
    if (bmi < 18.5) { categoryText = 'Underweight'; categoryClass = 'bg-blue-200 text-blue-800'; }
    else if (bmi < 25) { categoryText = 'Normal Weight'; categoryClass = 'bg-green-200 text-green-800'; }
    else if (bmi < 30) { categoryText = 'Overweight'; categoryClass = 'bg-yellow-200 text-yellow-800'; }
    else { categoryText = 'Obesity'; categoryClass = 'bg-red-200 text-red-800'; }

    document.getElementById('bmi-value').textContent = formattedBmi;
    const badge = document.getElementById('category-badge');
    badge.textContent = categoryText;
    badge.className = `px-3 py-1 text-sm rounded-full font-bold shadow-md ${categoryClass}`;
    badge.dataset.category = categoryText;
    document.getElementById('age-display').textContent = age;
    document.getElementById('result-box').classList.add('show');

    fetchHealthTips(categoryText, age);
}

function fetchHealthTips(category, age) {
    const tips = {
        'Underweight': ['Eat nutrient-dense meals', 'Include protein daily', 'Strength train 2x/week', 'Avoid empty calories', 'Rest well'],
        'Normal Weight': ['Maintain balanced diet', 'Exercise regularly', 'Stay hydrated', 'Sleep 7-8 hrs', 'Check health periodically'],
        'Overweight': ['Control portion sizes', 'Exercise 4-5x/week', 'Eat more vegetables', 'Limit sugary drinks', 'Track progress'],
        'Obesity': ['Consult a professional', 'Start moderate exercise', 'Follow structured diet', 'Avoid processed foods', 'Regular monitoring']
    };
    const contentDiv = document.getElementById('ai-tips-content');
    const tipsContainer = document.getElementById('ai-tips-container');
    const headerText = document.getElementById('ai-header-text');
    contentDiv.innerHTML = tips[category].map(tip => `<p>• ${tip}</p>`).join('');
    headerText.textContent = `Health Coach Advice (Age: ${age})`;
    tipsContainer.classList.add('show');
}

window.onload = clearResult;
