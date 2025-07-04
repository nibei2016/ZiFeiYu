const realms = ["练气", "筑基", "金丹", "元婴", "化神"];
let realmIndex = parseInt(localStorage.getItem("realmIndex")) || 0;
let energy = parseInt(localStorage.getItem("energy")) || 0;

function updateUI() {
  document.getElementById("realm").innerText = realms[realmIndex];
  document.getElementById("energy").innerText = energy;
  localStorage.setItem("realmIndex", realmIndex);
  localStorage.setItem("energy", energy);
}

function train() {
  energy += 10;
  updateUI();
}

function breakthrough() {
  const cost = (realmIndex + 1) * 100;
  if (energy >= cost && realmIndex < realms.length - 1) {
    energy -= cost;
    realmIndex++;
    alert("恭喜你突破到：" + realms[realmIndex]);
    updateUI();
  } else {
    alert("灵力不足，无法突破！");
  }
}

function reset() {
  if (confirm("是否重置修仙进度？")) {
    realmIndex = 0;
    energy = 0;
    updateUI();
  }
}

updateUI(); // 初始化
