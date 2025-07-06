const fs = require("fs");
const path = require("path");

describe("TaskAddModal implementation", () => {
  let src;
  beforeAll(() => {
    src = fs.readFileSync(
      path.resolve(__dirname, "../components/TaskAddModal.tsx"),
      "utf8",
    );
  });

  it("declares the Props interface with visible, onClose and onAdd", () => {
    expect(src).toMatch(/interface Props/);
    expect(src).toMatch(/visible:\s*boolean/);
    expect(src).toMatch(/onClose:\s*\(\)\s*=>\s*void/);
    expect(src).toMatch(
      /onAdd:\s*\(\s*text:\s*string,\s*color:\s*string,\s*dueDate:\s*string\s*\)\s*=>\s*void/,
    );
  });

  it("defines a PRESET_COLORS array with at least 5 entries", () => {
    expect(src).toMatch(/const PRESET_COLORS = \[/);
    const match = src.match(/const PRESET_COLORS = \[([\s\S]*?)\]/);
    const entries = match ? match[1].split(",").filter((s) => s.trim()) : [];
    expect(entries.length).toBeGreaterThanOrEqual(5);
  });

  it("holds state for text, date, showDatePicker, showTimePicker, color, and customColor", () => {
    [
      "text",
      "date",
      "showDatePicker",
      "showTimePicker",
      "color",
      "customColor",
    ].forEach((key) => {
      const re = new RegExp(`\\[${key}\\s*,`);
      expect(src).toMatch(re);
    });
  });

  it("builds dueString from date.toISOString and calls onAdd with it", () => {
    expect(src).toMatch(/const dueString = date\.toISOString\(\)/);
    expect(src).toMatch(/onAdd\(text\.trim\(\), finalColor, dueString\)/);
  });

  it("renders a Modal containing both Cancel and Add buttons", () => {
    expect(src).toMatch(
      /<Modal[\s\S]*?<Button[^>]*>\s*Cancel\s*<\/Button>[\s\S]*?<Button[^>]*>\s*Add\s*<\/Button>/,
    );
  });

  it("includes a DateTimePicker for date and time selection", () => {
    expect(src).toMatch(/<DateTimePicker[^>]*mode="date"/);
    expect(src).toMatch(/<DateTimePicker[^>]*mode="time"/);
  });

  it('has a ContentWrapper that branches on Platform.OS === "web"', () => {
    expect(src).toMatch(/Platform\.OS === "web"/);
    expect(src).toMatch(
      /TouchableWithoutFeedback onPress=\{Keyboard\.dismiss\}/,
    );
  });
});
