const fs = require("fs");
const path = require("path");

describe("SignInScreen implementation", () => {
  let src;
  beforeAll(() => {
    src = fs.readFileSync(
      path.resolve(__dirname, "../app/(tabs)/signin.tsx"),
      "utf8",
    );
  });

  it("exports a default SignInScreen function", () => {
    expect(src).toMatch(/export\s+default\s+function\s+SignInScreen\s*\(/);
  });

  it("wires onChangeText of each TextInput to the correct setter", () => {
    expect(src).toMatch(/onChangeText=\{setEmail\}/);
    expect(src).toMatch(/onChangeText=\{setPassword\}/);
  });

  it("reads TaskContext via useContext", () => {
    expect(src).toMatch(/useContext\s*\(\s*TaskContext\s*\)/);
  });

  it("has a handleSignIn async function", () => {
    expect(src).toMatch(/const\s+handleSignIn\s*=\s*async\s*\(\)\s*=>/);
  });

  it('calls signIn and then router.replace\\("\\/home"\\)', () => {
    expect(src).toMatch(
      /await\s+signIn\s*\(\s*email\.trim\(\),\s*password\s*\)/,
    );
    expect(src).toMatch(/router\.replace\("\/home"\)/);
  });

  it("renders the main <Text>Sign In</Text> and subheading", () => {
    expect(src).toMatch(/<Text[^>]*>\s*Sign In\s*<\/Text>/);
    expect(src).toMatch(/Welcome back to TaskNexus/);
  });

  it("renders two TextInput labels: Email and Password", () => {
    expect(src).toMatch(/label="Email"/);
    expect(src).toMatch(/label="Password"/);
  });

  it("renders a Sign In <Button>", () => {
    expect(src).toMatch(/<Button[^>]*>\s*Sign In\s*<\/Button>/);
  });

  it("includes the navigation link to register", () => {
    expect(src).toMatch(/router\.push\("\/register"\)/);
    expect(src).toMatch(/Don’t have an account\? Register/);
  });
});
