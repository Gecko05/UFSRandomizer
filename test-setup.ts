// Loaded before every test file (see bunfig.toml): gives tests a browser-like DOM
// (happy-dom) so components can be rendered and clicked with Testing Library.
import { GlobalRegistrator } from "@happy-dom/global-registrator";
import { afterEach } from "bun:test";

GlobalRegistrator.register();

// Imported after the DOM exists. Unmounts what each test rendered, so tests don't leak.
const { cleanup } = await import("@testing-library/react");
afterEach(cleanup);
