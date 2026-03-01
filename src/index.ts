import { definePlugin } from '@expressive-code/core';
import { h } from '@expressive-code/core/hast';
import * as icons from 'simple-icons';

interface PluginOptions {
	color: 'mono' | 'original';
}

const DEFAULT_OPTS = { color: 'mono' } satisfies PluginOptions;

const LANGUAGE_MAP = {
	js: { icon: icons.siJavascript, style: 'fill' },
	javascript: { icon: icons.siJavascript, style: 'fill' },
	ts: { icon: icons.siTypescript, style: 'fill' },
	typescript: { icon: icons.siTypescript, style: 'fill' },
	py: { icon: icons.siPython, style: 'stroke' },
	python: { icon: icons.siPython, style: 'stroke' },
	cpp: { icon: icons.siCplusplus, style: 'stroke' },
	php: { icon: icons.siPhp, style: 'stroke' },
	go: { icon: icons.siGo, style: 'stroke' },
	rust: { icon: icons.siRust, style: 'stroke' },
	rs: { icon: icons.siRust, style: 'stroke' },
	rb: { icon: icons.siRuby, style: 'stroke' },
	ruby: { icon: icons.siRuby, style: 'stroke' },
	swift: { icon: icons.siSwift, style: 'stroke' },
	kotlin: { icon: icons.siKotlin, style: 'stroke' },
	kt: { icon: icons.siKotlin, style: 'stroke' },
	dart: { icon: icons.siDart, style: 'stroke' },
	sql: { icon: icons.siPostgresql, style: 'stroke' },
	bash: { icon: icons.siGnubash, style: 'stroke' },
	sh: { icon: icons.siGnubash, style: 'stroke' },
	shell: { icon: icons.siGnubash, style: 'stroke' },
	yml: { icon: icons.siYaml, style: 'stroke' },
	yaml: { icon: icons.siYaml, style: 'stroke' },
	json: { icon: icons.siJson, style: 'stroke' },

	html: { icon: icons.siHtml5, style: 'stroke' },
	css: { icon: icons.siCss, style: 'stroke' },
	scss: { icon: icons.siSass, style: 'stroke' },
	react: { icon: icons.siReact, style: 'stroke' },
	jsx: { icon: icons.siReact, style: 'stroke' },
	tsx: { icon: icons.siReact, style: 'stroke' },
	vue: { icon: icons.siVuedotjs, style: 'stroke' },
	svelte: { icon: icons.siSvelte, style: 'stroke' },
	astro: { icon: icons.siAstro, style: 'stroke' },
	angular: { icon: icons.siAngular, style: 'stroke' },
	docker: { icon: icons.siDocker, style: 'stroke' },
	dockerfile: { icon: icons.siDocker, style: 'stroke' },
} as const satisfies Record<
	string,
	{ icon: icons.SimpleIcon; style: 'stroke' | 'fill' }
>;

export function pluginLanguageLogo(config?: PluginOptions) {
	const opts = config ?? DEFAULT_OPTS;
	return definePlugin({
		name: 'Language Logo',
		baseStyles: `
      .expressive-code .frame {
        position: relative;
      }
      .ec-lang-logo {
        position: absolute;
        width: 48px;
        height: 48px;
        bottom: 0.6rem;
        right: 0.6rem;
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: none;
        z-index: 999;
      }
    `,
		hooks: {
			postprocessRenderedBlock: async ({ codeBlock, renderData }) => {
				console.log('codeBlock: ', codeBlock);
				const lang = codeBlock.language;
				const foundLang = LANGUAGE_MAP[lang as keyof typeof LANGUAGE_MAP];

				console.log('foundLang: ', foundLang);
				if (!foundLang) {
					return;
				}

				const icon = foundLang.icon;

				const logoSvg = h('div', { class: 'ec-lang-logo' }, [
					h(
						'svg',
						{
							role: 'img',
							viewBox: '0 0 24 24',
							width: '32px',
							height: '32px',
							...(foundLang.style === 'stroke'
								? {
										stroke: opts.color === 'mono' ? '#fff' : `#${icon.hex}`,
									}
								: {
										fill: opts.color === 'mono' ? '#fff' : `#${icon.hex}`,
									}),
						},
						[
							h('title', { innerHtml: icon.title }),
							h('path', {
								d: icon.path,
							}),
						],
					),
				]);

				console.dir(logoSvg, { depth: Infinity });
				renderData.blockAst.children.push(logoSvg);
			},
		},
	});
}
