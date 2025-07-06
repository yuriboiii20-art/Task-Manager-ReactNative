const fs = require("fs");
const path = require("path");

describe("StatsScreen implementation", () => {
  let src;
  beforeAll(() => {
    src = fs.readFileSync(
      path.resolve(__dirname, "../app/(tabs)/stats.tsx"),
      "utf8",
    );
  });

  it("uses useContext to grab tasks from TaskContext", () => {
    expect(src).toMatch(/useContext\s*\(\s*TaskContext\s*\)\s*;/);
  });

  it("calculates totalTasks and completedTasks", () => {
    expect(src).toMatch(/const\s+totalTasks\s*=\s*tasks\.length/);
    expect(src).toMatch(
      /const\s+completedTasks\s*=\s*tasks\.filter\(\s*\(t\)\s*=>\s*t\.completed\s*\)\.length/,
    );
  });

  it("builds overdueCount and upcomingCount by iterating tasks", () => {
    expect(src).toMatch(/let\s+overdueCount\s*=\s*0/);
    expect(src).toMatch(/let\s+upcomingCount\s*=\s*0/);
    expect(src).toMatch(/tasks\.forEach\(\s*\(task\)\s*=>\s*{/);
  });

  it("groups tasks by month into an object tasksByMonth", () => {
    expect(src).toMatch(/const\s+tasksByMonth\s*[:{]/);
    expect(src).toMatch(
      /tasksByMonth\[monthKey\]\s*=\s*\(tasksByMonth\[monthKey\]\s*\|\|\s*0\)\s*\+\s*1/,
    );
  });

  it("prepares pieData, barData, and lineChartData", () => {
    expect(src).toMatch(/const\s+pieData\s*=\s*\[/);
    expect(src).toMatch(/const\s+barData\s*=\s*{[^}]*datasets/);
    expect(src).toMatch(/let\s+lineChartData\s*=\s*{[^}]*datasets/);
  });

  it("renders three Chart components (pie, bar, line)", () => {
    expect(src).toMatch(/<Chart[^>]*type="pie"/);
    expect(src).toMatch(/<Chart[^>]*type="bar"/);
    expect(src).toMatch(/<Chart[^>]*type="line"/);
  });

  it("animates background via useSharedValue, interpolateColor, and useEffect", () => {
    expect(src).toMatch(/useSharedValue\s*\(\s*1\s*\)/);
    expect(src).toMatch(/interpolateColor\s*\(/);
    expect(src).toMatch(
      /useEffect\(\s*\(\)\s*=>\s*{\s*progress\.value\s*=\s*0;/,
    );
  });

  it("wraps ScrollView in Animated.createAnimatedComponent", () => {
    expect(src).toMatch(
      /const\s+AnimatedScrollView\s*=\s*Animated\.createAnimatedComponent\(ScrollView\)/,
    );
    expect(src).toMatch(/<AnimatedScrollView[^>]*>/);
  });

  it("exports the component wrapped with withAuth", () => {
    expect(src).toMatch(/export\s+default\s+withAuth\s*\(\s*StatsScreen\s*\)/);
  });
});
