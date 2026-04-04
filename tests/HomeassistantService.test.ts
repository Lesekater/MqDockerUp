jest.mock("../src/services/ConfigService", () => ({
  __esModule: true,
  default: {
    getConfig: () => ({
      main: {
        prefix: "",
      },
      mqtt: {
        topic: "mqdockerup",
        discoveryPrefix: "homeassistant",
        suggestedArea: "Docker",
        haLegacy: false,
      },
    }),
    autoParseEnvVariable: (value: unknown) => value,
  },
}));

jest.mock("../src/services/DatabaseService", () => ({
  __esModule: true,
  default: {
    containerExists: jest.fn(),
    addContainer: jest.fn(),
    addTopic: jest.fn(),
    deleteContainer: jest.fn(),
    getTopics: jest.fn(),
  },
}));

jest.mock("../src/services/DockerService", () => ({
  __esModule: true,
  default: {
    listContainers: jest.fn(),
    getImageInfo: jest.fn(),
    getImageNewDigest: jest.fn(),
    getSourceRepo: jest.fn(),
    docker: {
      getContainer: jest.fn(),
    },
  },
}));

jest.mock("../src/services/IgnoreService", () => ({
  __esModule: true,
  default: {
    ignoreUpdates: jest.fn(() => false),
  },
}));

jest.mock("../src/services/LoggerService", () => ({
  __esModule: true,
  default: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  },
}));

import HomeassistantService from "../src/services/HomeassistantService";

describe("HomeassistantService.buildReleaseUrl", () => {
  it("builds a GitHub release notes URL from the repository and version", () => {
    expect(
      HomeassistantService.buildReleaseUrl(
        "https://github.com/MichelFR/MqDockerUp",
        "v1.2.3",
        "https://github.com/MichelFR/MqDockerUp"
      )
    ).toBe("https://github.com/MichelFR/MqDockerUp/releases/tag/v1.2.3");
  });

  it("normalizes a repository URL before building the release notes link", () => {
    expect(
      HomeassistantService.buildReleaseUrl(
        "github.com/MichelFR/MqDockerUp.git/",
        "1.2.3",
        "https://github.com/MichelFR/MqDockerUp"
      )
    ).toBe("https://github.com/MichelFR/MqDockerUp/releases/tag/1.2.3");
  });

  it("returns the repository URL for non-GitHub sources", () => {
    expect(
      HomeassistantService.buildReleaseUrl(
        "https://gitlab.com/group/project.git",
        "v1.2.3",
        "https://github.com/MichelFR/MqDockerUp"
      )
    ).toBe("https://gitlab.com/group/project");
  });

  it("falls back when the source repository cannot be parsed", () => {
    expect(
      HomeassistantService.buildReleaseUrl(
        "not a valid repository url",
        "v1.2.3",
        "https://github.com/MichelFR/MqDockerUp"
      )
    ).toBe("https://github.com/MichelFR/MqDockerUp");
  });
});