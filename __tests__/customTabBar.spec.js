const fs = require("fs");
const path = require("path");

describe("CustomTabBar implementation", () => {
  let src;
  beforeAll(() => {
    src = fs.readFileSync(
      path.resolve(__dirname, "../components/CustomTabBar.tsx"),
      "utf8",
    );
  });

  it("exports default function CustomTabBar", () => {
    expect(src).toMatch(/export default function CustomTabBar/);
  });

  it("defines handleLogout with async signOut and navigation.navigate", () => {
    expect(src).toMatch(/const handleLogout = async \(\)/);
    expect(src).toMatch(/await signOut\(\)/);
    expect(src).toMatch(/navigation\.navigate\("signin"/);
  });

  it("conditionally renders log-out icon when user is truthy", () => {
    const re = /user\s*\?\s*\([\s\S]*?name="log-out"/;
    expect(src).toMatch(re);
  });

  it("includes a theme-toggle TouchableOpacity with sun/moon icons", () => {
    expect(src).toMatch(/toggleTheme/);
    expect(src).toMatch(
      /Ionicons[\s\S]*name=\{colorSchemeOverride === "dark"\s*\?/,
    );
  });
});
