function calculateMineral() {

    const prices = {
        Gold: 1200,
        Silver: 12.64,
        Copper: 8.50,
        Iron: 2.30
    };

    const mineral = document.getElementById("mineral").value;
    const weight = document.getElementById("weight").value;
    const result = document.getElementById("result");

    if (mineral === "") {
        result.innerText = "Please select a mineral.";
        return;
    }

    if (weight === "" || weight <= 0) {
        result.innerText = "Please enter a valid weight.";
        return;
    }

    const total = weight * prices[mineral];
    result.innerText = `${mineral} price for ${weight}g is: R ${total.toFixed(2)}`;
}
