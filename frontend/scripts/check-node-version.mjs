const minimumNodeVersion = {
  major: 20,
  minor: 19,
  patch: 0,
};

function parseVersion(version) {
  const normalizedVersion = version.replace(/^v/, "");
  const [major = "0", minor = "0", patch = "0"] = normalizedVersion.split(".");

  return {
    major: Number(major),
    minor: Number(minor),
    patch: Number(patch),
  };
}

function isVersionLowerThanMinimum(version) {
  if (version.major !== minimumNodeVersion.major) {
    return version.major < minimumNodeVersion.major;
  }

  if (version.minor !== minimumNodeVersion.minor) {
    return version.minor < minimumNodeVersion.minor;
  }

  return version.patch < minimumNodeVersion.patch;
}

function formatVersion(version) {
  return `${version.major}.${version.minor}.${version.patch}`;
}

const currentNodeVersion = parseVersion(process.version);

if (isVersionLowerThanMinimum(currentNodeVersion)) {
  console.error("");
  console.error(
    `Node.js ${formatVersion(minimumNodeVersion)} ou superior e obrigatorio para este projeto.`,
  );
  console.error(`Versao atual detectada: ${process.version}`);
  console.error("");
  console.error("Se voce usa nvm, execute:");
  console.error("nvm use 20.19.0");
  console.error("");
  process.exit(1);
}
