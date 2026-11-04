
const SUPABASE_URL =
  "https://foqxszfpvxzpangyfhml.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_k1mIKAWrLFkDUsiGFt8FAA_W9WyOkgl";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

document.getElementById("year").textContent =
  new Date().getFullYear();

async function loadAccount() {
  const message = document.getElementById("account-message");
  const content = document.getElementById("account-content");

  const { data: sessionData, error: sessionError } =
    await supabaseClient.auth.getSession();

  if (sessionError || !sessionData.session) {
    message.textContent = "Please login with Discord first.";
    return;
  }

  const user = sessionData.session.user;
  const discordId = user.user_metadata.provider_id;

  const username =
    user.user_metadata.global_name ||
    user.user_metadata.name ||
    "VIAA Member";

  const avatar =
    user.user_metadata.avatar_url ||
    user.user_metadata.picture ||
    "";

  document.getElementById("profile-username").textContent =
    username;

  document.getElementById("profile-avatar").src = avatar;

  // Fetch member profile
  const { data: profile, error: profileError } =
    await supabaseClient
      .from("member_profiles")
      .select("discord_id, username, role, skymiles")
      .eq("discord_id", discordId)
      .maybeSingle();

  if (profileError) {
    message.textContent =
      "Could not load your member profile.";
    console.error(profileError);
    return;
  }

  if (!profile) {
    message.textContent =
      "Your Discord account is logged in, but your VIAA member profile has not been created yet.";
    return;
  }

  document.getElementById("profile-username").textContent =
    profile.username || username;

  document.getElementById("profile-role").textContent =
    "Server Role: " + (profile.role || "Member");

  document.getElementById("role-display").textContent =
    profile.role || "Member";

  document.getElementById("miles-balance").textContent =
    Number(profile.skymiles || 0).toLocaleString();

  // Fetch recognised servers
  const { data: servers, error: serversError } =
    await supabaseClient
      .from("recognized_servers")
      .select("server_name, status")
      .eq("status", "recognized");

  const serverContainer =
    document.getElementById("recognized-servers");

  serverContainer.innerHTML = "";

  if (serversError) {
    serverContainer.textContent =
      "Could not load recognised servers.";
  } else if (!servers || servers.length === 0) {
    serverContainer.textContent =
      "No recognised servers yet.";
  } else {
    servers.forEach(server => {
      const item = document.createElement("div");
      item.className = "account-item";

      const name = document.createElement("span");
      name.textContent = server.server_name;

      const status = document.createElement("span");
      status.className = "status status-approved";
      status.textContent = "Recognised";

      item.append(name, status);
      serverContainer.appendChild(item);
    });
  }

  // Fetch member application
  const { data: application, error: applicationError } =
    await supabaseClient
      .from("applications")
      .select("status, application_type")
      .eq("discord_id", discordId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

  const applicationContainer =
    document.getElementById("my-application");

  applicationContainer.innerHTML = "";

  if (applicationError) {
    applicationContainer.textContent =
      "Could not load your application.";
  } else if (!application) {
    applicationContainer.textContent =
      "You have not submitted an application.";
  } else {
    const item = document.createElement("div");
    item.className = "account-item";

    const applicationName = document.createElement("span");
    applicationName.textContent =
      application.application_type || "VIAA Application";

    const status = document.createElement("span");

    const applicationStatus =
      (application.status || "pending").toLowerCase();

    status.className = "status status-" +
      applicationStatus;

    status.textContent = applicationStatus;

    item.append(applicationName, status);
    applicationContainer.appendChild(item);
  }

  message.textContent = "";
  content.hidden = false;
}

loadAccount();
