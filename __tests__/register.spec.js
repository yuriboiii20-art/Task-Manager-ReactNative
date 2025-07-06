const fs = require("fs");
const path = require("path");

describe("RegisterScreen implementation", () => {
  const filePath = path.resolve(__dirname, "../app/(tabs)/register.tsx");
  let src;
  beforeAll(() => {
    src = fs.readFileSync(filePath, "utf8");
  });

  it("exports a default RegisterScreen function", () => {
    expect(src).toMatch(/export\s+default\s+function\s+RegisterScreen\s*\(/);
  });

  it("wires onChangeText of each TextInput to the correct setter", () => {
    expect(src).toMatch(/onChangeText=\{setEmail\}/);
    expect(src).toMatch(/onChangeText=\{setPassword\}/);
    expect(src).toMatch(/onChangeText=\{setConfirmPassword\}/);
  });

  it("reads TaskContext via useContext", () => {
    expect(src).toMatch(/useContext\s*\(\s*TaskContext\s*\)/);
  });

  it("has a handleRegister async function", () => {
    expect(src).toMatch(/const\s+handleRegister\s*=\s*async\s*\(\)\s*=>/);
  });

  it("checks for mismatched passwords and sets error", () => {
    expect(src).toMatch(
      /if\s*\(\s*password\s*!==\s*confirmPassword\s*\)\s*{[\s\S]*?setError\("Passwords do not match\."\)/,
    );
  });

  it('calls signUp and then router.replace\\("\\/home"\\)', () => {
    expect(src).toMatch(
      /await\s+signUp\s*\(\s*email\.trim\(\),\s*password\s*\)/,
    );
    expect(src).toMatch(/router\.replace\("\/home"\)/);
  });

  it("renders the main <Text>Register</Text> and subheading", () => {
    expect(src).toMatch(/<Text[^>]*>\s*Register\s*<\/Text>/);
    expect(src).toMatch(/Create your free TaskNexus account/);
  });

  it("renders three TextInput labels: Email, Password, Confirm Password", () => {
    expect(src).toMatch(/label="Email"/);
    expect(src).toMatch(/label="Password"/);
    expect(src).toMatch(/label="Confirm Password"/);
  });

  it("renders a Register <Button>", () => {
    expect(src).toMatch(/<Button[^>]*>\s*Register\s*<\/Button>/);
  });

  it("includes the navigation link to signin", () => {
    expect(src).toMatch(/router\.push\("\/signin"\)/);
    expect(src).toMatch(/Already have an account\? Sign In/);
  });
});
