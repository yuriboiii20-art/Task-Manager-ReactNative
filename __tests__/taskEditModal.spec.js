const fs = require("fs");
const path = require("path");

describe("TaskEditModal implementation", () => {
  let src;
  beforeAll(() => {
    src = fs.readFileSync(
      path.resolve(__dirname, "../components/TaskEditModal.tsx"),
      "utf8",
    );
  });

  it("exports a default TaskEditModal function", () => {
    expect(src).toMatch(/export default function TaskEditModal/);
  });

  it("declares the Props interface with visible, onClose, task and onEdit", () => {
    expect(src).toMatch(/interface Props/);
    expect(src).toMatch(/visible:\s*boolean;/);
    expect(src).toMatch(/onClose:\s*\(\)\s*=>\s*void;/);
    expect(src).toMatch(/task:\s*{\s*id:\s*number;\s*text:\s*string;/);
    expect(src).toMatch(
      /onEdit:\s*\(\s*newText:\s*string,\s*newColor:\s*string,\s*newDueDate:\s*Date\s*\)\s*=>\s*void;/,
    );
  });

  it("defines a PRESET_COLORS array of at least 5 hex entries", () => {
    expect(src).toMatch(/const PRESET_COLORS = \[/);
    const match = src.match(/const PRESET_COLORS = \[([\s\S]*?)\]/);
    const entries = match ? match[1].split(",").filter((s) => /#/.test(s)) : [];
    expect(entries.length).toBeGreaterThanOrEqual(5);
  });

  it("handleEditTask trims text, picks finalColor and calls onEdit", () => {
    expect(src).toMatch(/const handleEditTask = \(\) =>/);
    expect(src).toMatch(/if \(!text\.trim\(\)\) return;/);
    expect(src).toMatch(/onEdit\(text\.trim\(\), finalColor, date\)/);
    expect(src).toMatch(/handleClose\(\)/);
  });

  it("renders a Modal with both Cancel and Save buttons", () => {
    const re =
      /<Modal[\s\S]*?<Button[^>]*>\s*Cancel\s*<\/Button>[\s\S]*?<Button[^>]*>\s*Save\s*<\/Button>/;
    expect(src).toMatch(re);
  });

  it('includes ContentWrapper branching on Platform\.OS === "web"', () => {
    expect(src).toMatch(/Platform\.OS === "web"/);
    expect(src).toMatch(
      /TouchableWithoutFeedback onPress=\{Keyboard\.dismiss\}/,
    );
  });
});
