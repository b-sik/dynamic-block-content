import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';
import { createHigherOrderComponent } from '@wordpress/compose';
import { cloneElement, Children } from '@wordpress/element';
import { BlockControls } from '@wordpress/block-editor';
import {
  ALLOWED_BLOCKS,
  THE_DYNAMIC_CONTENT_STRING,
} from '../../constants.json';
import { META_KEY_ATTS, ALLOWED_BLOCKS_SETTINGS } from '../config';
import PostMetaControls from '../components/PostMetaControls.jsx';

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
 * @returns {Object} Updated block settings.
 */
const withMetaAtts = (settings, name) => {
  if (!ALLOWED_BLOCKS.includes(name)) {
    return settings;
  }

  Object.assign(settings.attributes, META_KEY_ATTS);

  return settings;
};

addFilter(
  'blocks.registerBlockType',
  'bszyk/dynamic-content/with-meta-atts',
  withMetaAtts
);

/**
 * Keep blocks in editor updated if a meta value has since changed.
 *
 * @param {Object} attributes Block attributes. 
 * @param {Object} settings Block settings.
 *
 * @returns {Object} Updated attributes.
 */
const withCurrentMeta = (attributes, settings) => {
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
  if (!Object.keys(postMeta).includes(metaKey)) {
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
  'bszyk/dynamic-content/with-current-meta',
  withCurrentMeta
);

/**
 * Updates a block's content on save if it is enabled to be a dynamic meta block.
 *
 * This avoids validation errors by keeping `post_content` in the db consistent.
 * Blocks are then updated separately for the frontend and editor upon render.
 *
 * @param {Object} element Element.
 * @param {Object} settings Block settings.
 * @param {Object} atts Block attributes.
 * 
 * @returns {Object} Element with generic .
 */
const withDynamicContent = (element, settings, atts) => {
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
  'bszyk/dynamic-content/with-dynamic-content',
  withDynamicContent
);

/**
 * Add Inspector Controls and Toolbars to allowed blocks.
 */
const withToolbarsAndControls = createHigherOrderComponent((BlockEdit) => {
  return (props) => {
    if (!ALLOWED_BLOCKS.includes(props.name)) {
      return <BlockEdit {...props} />;
    }

    return (
      <>
        <BlockEdit {...props} />
        <BlockControls>
            <PostMetaControls />
        </BlockControls>
      </>
    );
  };
}, 'withToolbarsAndControls');

addFilter(
  'editor.BlockEdit',
  'bszyk/dynamic-content/with-toolbar-icon',
  withToolbarsAndControls
);
