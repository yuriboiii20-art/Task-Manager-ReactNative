const fs = require("fs");
const path = require("path");

describe("TaskContext implementation", () => {
  let src;
  beforeAll(() => {
    src = fs.readFileSync(
      path.resolve(__dirname, "../contexts/TaskContext.tsx"),
      "utf8",
    );
  });

  it("defines a Zod schema named TaskDBSchema", () => {
    expect(src).toMatch(/const TaskDBSchema\s*=\s*z\.object/);
  });

  it("exports TaskContext via createContext", () => {
    expect(src).toMatch(/export const TaskContext = createContext/);
  });

  it("exports TaskProvider as a React component", () => {
    expect(src).toMatch(/export const TaskProvider: FC/);
  });

  it("includes utility reorderTasksAlg function", () => {
    expect(src).toMatch(/function reorderTasksAlg/);
  });
});
