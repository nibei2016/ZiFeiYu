const realms = ["练气", "筑基", "金丹", "元婴", "化神", "合体", "大乘", "渡劫", "飞升"];
const roots = ["金灵根", "木灵根", "水灵根", "火灵根", "土灵根", "天灵根"];
let realmIndex = 0;
let energy = 0;
let eventsToday = 0;

let character = {
  name: "",
  root: "",
  wits: 0,
  sense: 0,
  techniqueLevel: 1
};

function rollAttributes() {
  character.root = roots[getRandom(0, roots.length - 1)];
  character.wits = getRandom(4, 10);
  character.sense = getRandom(4, 10);
  character.techniqueLevel = 1;
  const attrDiv = document.getElementById("attributes");
  attrDiv.innerHTML = `
    <p>灵根：${character.root}</p>
    <p>悟性：${character.wits}</p>
    <p>灵力感知：${character.sense}</p>`;
}

function startGame() {
  const nameInput = document.getElementById("charName").value.trim();
  if (!nameInput) {
    alert("道友，请赐予一个道号。");
    return;
  }
  character.name = nameInput;
  localStorage.setItem("character", JSON.stringify(character));
  localStorage.setItem("realmIndex", 0);
  localStorage.setItem("energy", 0);
  localStorage.setItem("eventsToday", 0);
  document.getElementById("create-character").style.display = "none";
  document.getElementById("game").style.display = "block";
  initGame();
}

function initGame() {
  const savedChar = localStorage.getItem("character");
  if (savedChar) {
    character = JSON.parse(savedChar);
    realmIndex = parseInt(localStorage.getItem("realmIndex")) || 0;
    energy = parseInt(localStorage.getItem("energy")) || 0;
    eventsToday = parseInt(localStorage.getItem("eventsToday")) || 0;
    document.getElementById("welcome").innerText = `道友 ${character.name}，修行不辍，莫问前程。`;
    updateUI();
  }
}

function updateUI() {
  document.getElementById("realm").innerText = realms[realmIndex];
  document.getElementById("energy").innerText = energy;
  localStorage.setItem("realmIndex", realmIndex);
  localStorage.setItem("energy", energy);
  localStorage.setItem("eventsToday", eventsToday);
}

function meditate(days = 1) {
  let totalGain = 0;
  for (let i = 0; i < days; i++) {
    const gain = 10 + character.wits + character.techniqueLevel * 2;
    energy += gain;
    totalGain += gain;
    tryTriggerEvent();
  }
  logStory(`你静心修炼 ${days} 日，灵力增长 ${totalGain} 点。`);
  updateUI();
}

function breakthrough() {
  const cost = (realmIndex + 1) * 100;
  if (energy >= cost && realmIndex < realms.length - 1) {
    const chance = character.sense * 10;
    const roll = getRandom(1, 100);
    if (roll <= chance) {
      energy -= cost;
      realmIndex++;
      logStory(`✨ 你成功突破至 ${realms[realmIndex]}！天道可期！`);
    } else {
      logStory("☁️ 冲击失败，心魔缠身，须静心调息。");
    }
    updateUI();
  } else {
    logStory("灵力尚浅，无法突破。");
  }
}

function studyTechnique() {
  if (energy >= 50 * character.techniqueLevel) {
    energy -= 50 * character.techniqueLevel;
    character.techniqueLevel++;
    logStory(`📖 你潜心研读古籍，功法已提升至第 ${character.techniqueLevel} 层！`);
    updateUI();
  } else {
    logStory("灵力不足，无法提升功法。");
  }
}

function reset() {
  if (confirm("你确定要重修此生？")) {
    localStorage.clear();
    location.reload();
  }
}

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function logStory(text) {
  const logDiv = document.getElementById("story-log");
  const p = document.createElement("p");
  p.innerText = text;
  logDiv.appendChild(p);
  logDiv.scrollTop = logDiv.scrollHeight;
}

function tryTriggerEvent() {
  if (eventsToday >= 3) return; // 每次加载最多触发3次
  if (getRandom(1, 100) <= 20) {
    triggerRandomEvent();
    eventsToday++;
  }
}

function triggerRandomEvent() {
  const events = [
    {
      title: "🌌 星辰引力",
      description: "夜观天象，感悟天道星辰之力。",
      choices: [
        { text: "沐浴星辉", effect: () => { energy += 60; logStory("灵力+60，心神通明。"); } },
        { text: "记于心间", effect: () => { character.wits += 1; logStory("悟性+1，记忆深刻。"); } }
      ]
    },
    {
      title: "🧘‍♂️ 老僧问道",
      description: "你遇到一位老僧，他问你‘何为修行？’",
      choices: [
        { text: "静心", effect: () => { character.sense += 1; logStory("灵力感知+1，你心有所悟。"); } },
        { text: "精进", effect: () => { character.techniqueLevel += 1; logStory("功法修炼提升1级。"); } }
      ]
    }
  ];
  const chosen = events[getRandom(0, events.length - 1)];
  logStory(`[奇遇] ${chosen.title}：${chosen.description}`);

  const box = document.getElementById("event-box");
  box.innerHTML = "";
  chosen.choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.innerText = `【${choice.text}】`;
    btn.onclick = () => {
      choice.effect();
      logStory(`你选择了：${choice.text}`);
      box.innerHTML = "";
      updateUI();
    };
    btn.style = "margin: 0.3em;";
    box.appendChild(btn);
  });
}

window.onload = () => {
  if (localStorage.getItem("character")) {
    document.getElementById("create-character").style.display = "none";
    document.getElementById("game").style.display = "block";
    initGame();
  }
};
