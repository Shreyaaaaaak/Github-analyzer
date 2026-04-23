let chartInstance = null;

async function analyze() {
  const username = document.getElementById("username").value.trim();

  if (!username) {
    alert("Enter a GitHub username");
    return;
  }

  // UI states
  document.getElementById("loader").classList.remove("hidden");
  document.getElementById("results").classList.add("hidden");
  document.getElementById("error").classList.add("hidden");

  try {
    // =========================
    // FETCH USER DATA
    // =========================
    const userRes = await fetch(`https://api.github.com/users/${username}`);
    const user = await userRes.json();

    if (user.message === "Not Found") {
      throw new Error("User not found");
    }

    // Fill profile
    document.getElementById("name").textContent = user.name || user.login;
    document.getElementById("login-badge").textContent = `@${user.login}`;
    document.getElementById("avatar").src = user.avatar_url;
    document.getElementById("bio").textContent = user.bio || "No bio available";

    document.getElementById("followers").textContent = user.followers;
    document.getElementById("following").textContent = user.following;
    document.getElementById("repos").textContent = user.public_repos;
    document.getElementById("gists").textContent = user.public_gists;

    document.getElementById("github-link").href = user.html_url;

    // =========================
    // FETCH REPOS
    // =========================
    const repoRes = await fetch(user.repos_url + "?per_page=100");
    const repos = await repoRes.json();

    // =========================
    // LANGUAGE ANALYSIS
    // =========================
    const langCount = {};

    repos.forEach(repo => {
      if (repo.language) {
        langCount[repo.language] = (langCount[repo.language] || 0) + 1;
      }
    });

    const labels = Object.keys(langCount);
    const values = Object.values(langCount);

    if (labels.length === 0) {
      document.getElementById("no-lang").classList.remove("hidden");
    } else {
      document.getElementById("no-lang").classList.add("hidden");
      renderChart(labels, values);
    }

    // =========================
    // TOP REPOS
    // =========================
    const sortedRepos = repos
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 5);

    const repoList = document.getElementById("repo-list");
    repoList.innerHTML = "";

    sortedRepos.forEach(repo => {
      const div = document.createElement("div");
      div.className = "repo-item";

      div.innerHTML = `
        <a href="${repo.html_url}" target="_blank">${repo.name}</a>
        <p>${repo.description || "No description"}</p>
        <div class="repo-meta">
          ⭐ ${repo.stargazers_count}
          🍴 ${repo.forks_count}
        </div>
      `;

      repoList.appendChild(div);
    });

    // Show results
    document.getElementById("results").classList.remove("hidden");
    document.getElementById("results").classList.add("fade-in");

  } catch (err) {
    console.error(err);
    document.getElementById("error").textContent = err.message || "Something went wrong";
    document.getElementById("error").classList.remove("hidden");
  }

  document.getElementById("loader").classList.add("hidden");
}

/* =========================
   CHART RENDER FUNCTION
========================= */
function renderChart(labels, values) {
  const canvas = document.getElementById("langChart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  // Destroy old chart (important)
  if (chartInstance) {
    chartInstance.destroy();
  }

  // Gradients
  const gradient1 = ctx.createLinearGradient(0, 0, 0, 300);
  gradient1.addColorStop(0, "#A67C87");
  gradient1.addColorStop(1, "#9C92AC");

  const gradient2 = ctx.createLinearGradient(0, 0, 0, 300);
  gradient2.addColorStop(0, "#8FA39A");
  gradient2.addColorStop(1, "#CBB7A3");

  const gradient3 = ctx.createLinearGradient(0, 0, 0, 300);
  gradient3.addColorStop(0, "#9C92AC");
  gradient3.addColorStop(1, "#E3D6CE");

  chartInstance = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: labels,
      datasets: [{
        data: values,
        backgroundColor: [gradient1, gradient2, gradient3],
        borderWidth: 0,
        hoverOffset: 8
      }]
    },
    options: {
      responsive: true,
      cutout: "65%",
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: "#7A6A70",
            font: { size: 12 }
          }
        },
        tooltip: {
          backgroundColor: "#FFFFFF",
          titleColor: "#3A2E33",
          bodyColor: "#7A6A70",
          borderColor: "#E3D6CE",
          borderWidth: 1,
          padding: 10
        }
      }
    }
  });
}