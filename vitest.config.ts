import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	plugins: [tsconfigPaths()],

	test: {
		globals: true,
		environment: "node",

		// Onde ficam seus testes
		include: ["src/**/*.{test,spec}.ts"],

		// Relatórios úteis em times grandes
		reporters: ["verbose"],

		// Arquivo de setup (antes de todos os testes)
		setupFiles: ["./test/setup.ts"],

		// Coverage
		coverage: {
			provider: "v8",
			reportsDirectory: "./coverage",
			reporter: ["text", "html", "json"],
			all: true,
			include: ["src"],
		},
	},
});
