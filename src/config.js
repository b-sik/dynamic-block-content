import * as CONSTANTS from "../constants.json";

export const ALLOWED_BLOCKS = CONSTANTS.ALLOWED_BLOCKS;
export const THE_DYNAMIC_CONTENT_STRING = CONSTANTS.THE_DYNAMIC_CONTENT_STRING;

/** Attributes to add to allowed blocks */
export const META_KEY_ATTS = {
	dc_enabled: {
		type: "boolean",
		default: false,
	},
	dc_metakey: {
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
