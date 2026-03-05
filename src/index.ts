import { definePlugin } from '@expressive-code/core';
import { h } from '@expressive-code/core/hast';
import * as icons from 'simple-icons';

const LANGUAGE_MAP = {
	js: { icon: icons.siJavascript },
	javascript: { icon: icons.siJavascript },
	ts: { icon: icons.siTypescript },
	typescript: { icon: icons.siTypescript },
	py: { icon: icons.siPython },
	python: { icon: icons.siPython },
	cpp: { icon: icons.siCplusplus },
	php: { icon: icons.siPhp },
	go: { icon: icons.siGo },
	rust: { icon: icons.siRust },
	rs: { icon: icons.siRust },
	rb: { icon: icons.siRuby },
	ruby: { icon: icons.siRuby },
	swift: { icon: icons.siSwift },
	kotlin: { icon: icons.siKotlin },
	kt: { icon: icons.siKotlin },
	dart: { icon: icons.siDart },
	sql: { icon: icons.siPostgresql },
	bash: { icon: icons.siGnubash },
	sh: { icon: icons.siGnubash },
	shell: { icon: icons.siGnubash },
	yml: { icon: icons.siYaml },
	yaml: { icon: icons.siYaml },
	json: { icon: icons.siJson },
	graphql: { icon: icons.siGraphql },
	gql: { icon: icons.siGraphql },

	html: { icon: icons.siHtml5 },
	css: { icon: icons.siCss },
	scss: { icon: icons.siSass },
	react: { icon: icons.siReact },
	md: { icon: icons.siMarkdown },
	markdown: { icon: icons.siMarkdown },
	mdx: { icon: icons.siMdx },
	jsx: { icon: icons.siReact },
	tsx: { icon: icons.siReact },
	vue: { icon: icons.siVuedotjs },
	svelte: { icon: icons.siSvelte },
	astro: { icon: icons.siAstro },
	angular: { icon: icons.siAngular },
	docker: { icon: icons.siDocker },
	dockerfile: { icon: icons.siDocker },
} as const;

type Language = keyof typeof LANGUAGE_MAP;

type Color = 'mono' | 'original' | 'theme' | (`#${string}` & {});

interface PluginOptions {
	color: Color;
	excludedLangs: Language[];
}

const DEFAULT_OPTS = {
	color: 'mono',
	excludedLangs: [],
} satisfies PluginOptions;

export function pluginLanguageLogo(config?: PluginOptions) {
	const opts = { ...DEFAULT_OPTS, ...config };

	return definePlugin({
		name: 'Language Logo',
		baseStyles: `
      html[data-theme=light] {
      --ec-lang-logo: #111;
      }

      html[data-theme=dark] {
      --ec-lang-logo: #fff;
      }

      .ec-lang-logo {
        position: absolute;
        width: 48px;
        height: 48px;
        bottom: 0.6rem;
        right: 0.6rem;
        display: flex;
        opacity: 0.2;
        transition: all 0.3s ease-out;
        align-items: center;
        justify-content: center;
        pointer-events: none;
        z-index: 10;
      }
      [data-ec-logo-small=true] {
        width: 32px;
        height: 32px;
        bottom: 0.8rem;
        right: 2.7rem; 
      }

      .expressive-code:hover .ec-lang-logo {
        opacity: 0.8;
      }
    `,
		hooks: {
			postprocessRenderedBlock: async ({ codeBlock, renderData }) => {
				if (codeBlock.meta.includes('hide-badge')) {
					return;
				}
				const colorMatch = codeBlock.meta.match(
					/badge-color=(?:["']([^"']+)["']|([^ \t\n\r\f]+))/,
				);
				const lang = codeBlock.language as Language;
				if (opts.excludedLangs.includes(lang)) {
					return;
				}

				const foundLang = LANGUAGE_MAP[lang];

				if (!foundLang) {
					return;
				}
				const loc = codeBlock.getLines().length;
				const icon = foundLang.icon;
				const color = colorMatch
					? ((colorMatch[1] || colorMatch[2]) as Color)
					: opts.color;

				const logoSvg = h(
					'div',
					{
						class: 'ec-lang-logo',
						'data-ec-logo-small': loc === 1 ? 'true' : undefined,
					},
					[
						h(
							'svg',
							{
								role: 'img',
								viewBox: '0 0 24 24',
								width: loc === 1 ? '24px' : '32px',
								height: loc === 1 ? '24px' : '32px',
								fill: getFillColor(color, icon.hex),
							},
							[
								h('title', { innerHtml: icon.title }),
								h('path', {
									d: icon.path,
								}),
							],
						),
					],
				);

				renderData.blockAst.children.push(logoSvg);
			},
		},
	});
}

function getFillColor(color: Color, iconHex: string): string {
	if (color === 'mono') {
		return 'var(--ec-lang-logo)';
	}
	if (color === 'theme') {
		return 'var(--ec-codeFg)';
	}
	if (color === 'original') {
		return `#${iconHex}`;
	}
	return color;
}
