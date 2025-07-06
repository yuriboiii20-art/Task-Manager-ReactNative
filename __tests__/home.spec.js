const fs = require("fs");
const path = require("path");

describe("HomeScreen implementation", () => {
  let src;
  beforeAll(() => {
    src = fs.readFileSync(
      path.resolve(__dirname, "../app/(tabs)/home.tsx"),
      "utf8",
    );
  });

  it("defines a getGreeting helper function", () => {
    expect(src).toMatch(/function\s+getGreeting\s*\(\)\s*{/);
    expect(src).toMatch(/new\s+Date\(\)\.getHours\(\)/);
  });

  it("wraps and exports HomeScreen with withAuth", () => {
    expect(src).toMatch(/export\s+default\s+withAuth\s*\(\s*HomeScreen\s*\)/);
  });

  it("renders a DraggableFlatList with data={tasks}", () => {
    expect(src).toMatch(/<DraggableFlatList[^>]+data=\{tasks\}/);
  });

  it("includes the TaskAddModal with correct props", () => {
    expect(src).toMatch(
      /<TaskAddModal\s+visible=\{modalVisible\}\s+onClose=\{\(\)\s*=>\s*setModalVisible\(false\)\}\s+onAdd=\{handleAddTask\}/,
    );
  });

  it("uses TouchableWithoutFeedback to dismiss keyboard", () => {
    expect(src).toMatch(
      /<TouchableWithoutFeedback\s+onPress=\{\(\)\s*=>\s*Keyboard\.dismiss\(\)\}\s*>/,
    );
  });

  it("animates background color via useSharedValue and interpolateColor", () => {
    expect(src).toMatch(/useSharedValue\s*\(\s*1\s*\)/);
    expect(src).toMatch(/interpolateColor\s*\(/);
  });
});
