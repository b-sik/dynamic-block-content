import { addFilter } from '@wordpress/hooks';
import { cloneElement, Children } from '@wordpress/element';
import {
  ALLOWED_BLOCKS,
  THE_DYNAMIC_CONTENT_STRING,
} from '../../constants.json';
import { META_KEY_ATTS, ALLOWED_BLOCKS_SETTINGS } from '../config';

/**
 * Meta global.
 */
const { postMeta } = dynamicContent;

/**
 * Add metakey attributes to core blocks.
 *
 * @param {Object} settings Block settings.
 * @param {string} name Block name.
 *
 * @returns {Object} Block settings.
 */
const addMetaAttsToBlocks = (settings, name) => {
  if (!ALLOWED_BLOCKS.includes(name)) {
    return settings;
  }

  Object.assign(settings.attributes, META_KEY_ATTS);

  return settings;
};

addFilter(
  'blocks.registerBlockType',
  'bszyk/dynamic-content/add-meta-atts-to-blocks',
  addMetaAttsToBlocks
);

/**
 * Keep blocks in editor updated if a meta value has since changed.
 */
const updateBlocksInEditorOnLoad = (attributes, settings, innerHTML) => {
  if (
    !ALLOWED_BLOCKS.includes(settings.name) ||
    'undefined' === typeof attributes['dc_metakey'] ||
    null === attributes['dc_metakey']
  ) {
    return attributes;
  }

  // grab meta key.
  const metaKey = attributes['dc_metakey'];

  // check if the key still exists.
  if ( !Object.keys(postMeta).includes(metaKey) ) {
    attributes['dc_metakey'] = '';
    return attributes;
  }

  // get the content key for the block.
  const { contentAttKey } = ALLOWED_BLOCKS_SETTINGS[settings.name];

  // update the content.
  attributes[contentAttKey] = postMeta[metaKey];

  return attributes;
};

addFilter(
  'blocks.getBlockAttributes',
  'bszyk/dynamic-content/update-blocks-in-editor-on-load',
  updateBlocksInEditorOnLoad
);

/**
 * Updates a block's content on save if it is enabled to be a dynamic meta block.
 *
 * This avoids validation errors by keeping `post_content` in the db consistent.
 * Blocks are then updated separately for the frontend and editor upon render.
 *
 * @param {Object} element Element.
 * @param {Object} settings Block settings.
 * @param {Object} name Block attributes.
 *
 * @returns {Object} Processed element.
 */
const updateBlockContent = (element, settings, atts) => {
  if (
    !ALLOWED_BLOCKS.includes(settings.name) ||
    'undefined' === typeof atts['dc_metakey'] ||
    null === atts['dc_metakey'] ||
    '' === atts['dc_metakey']
  ) {
    return element;
  }

  // currently relying on there being one child (the text node).
  if (1 !== Children.count(element.props.children)) {
    return element;
  }

  // update the value of the text node.
  // all the cloning is necessary because `props` is read only.
  const newChildren = Children.map(element.props.children, (child) =>
    cloneElement(child, { value: THE_DYNAMIC_CONTENT_STRING })
  )[0];

  // add the updated child into a clone of the element.
  const newElement = cloneElement(element, { children: newChildren });

  return newElement;
};

addFilter(
  'blocks.getSaveElement',
  'bszyk/dynamic-content/update-block-content',
  updateBlockContent
);
