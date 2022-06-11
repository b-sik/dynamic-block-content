export const ALLOWED_BLOCKS = ["core/paragraph", "core/heading", "core/verse"];
export const THE_DYNAMIC_CONTENT_STRING = "[[bszyk-dynamic-content]]";

/** Attributes to add to allowed blocks */
export const META_KEY_ATTS = {
	dbc_enabled: {
		type: "boolean",
		default: false,
	},
	dbc_metakey: {
		type: "string",
	},
};

/** Config for allowed blocks */
export const ALLOWED_BLOCKS_SETTINGS = {
	"core/paragraph": {
		contentAttKey: "content",
	},
	"core/heading": {
		contentAttKey: "content",
	},
	"core/verse": {
		contentAttKey: "content",
	},
};
