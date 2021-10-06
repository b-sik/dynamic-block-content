import {
    Button,
    SelectControl,
    PanelBody,
    PanelRow,
  } from '@wordpress/components';
  import { useState, useEffect } from '@wordpress/element';
  import { __ } from '@wordpress/i18n';
  import { useSelect, dispatch } from '@wordpress/data';
  
  const UserMetaOptions = () => {
    /**
     * Meta global.
     */
    const { userMeta } = dynamicContent;
  
    /**
     * Create options for user meta keys.
     * @returns {Array<Object>}
     */
    const userMetaKeyOptions = () => {
      let options = [];
  
      Object.keys(userMeta).forEach((key) => {
        options.push({ value: key, label: key });
      });
  
      return options;
    };
  
    /**
     * Set selected user meta key state.
     */
    const [selectedUserMetaKey, setUserMetaKey] = useState(
      userMetaKeyOptions().length > 0 ? userMetaKeyOptions()[0].value : null
    );
  
    /**
     * Create options for user meta values.
     * @returns {Array<Object>}
     */
    const userMetaValueOptions = () => {
      let options = [];
  
      userMeta[selectedUserMetaKey].forEach((value) => {
        options.push({ value: value, label: value });
      });
  
      return options;
    };
  
    /**
     * Set selected user meta value state.
     */
    const [selectedUserMetaValue, setUserMetaValue] = useState(
      userMetaValueOptions().length > 0 ? userMetaValueOptions()[0].value : null
    );

    /**
     * Keep meta value current.
     */
    useEffect(() => {
        setUserMetaValue(userMeta[selectedUserMetaKey][0]);
    }, [selectedUserMetaKey])
  
    /**
     * Get the currently selected block.
     */
    const selectedBlock = useSelect((select) =>
      select('core/block-editor').getSelectedBlock()
    );
  
    /**
     * Update selected block's content.
     * @param {Object} block Selected block.
     * @param {string} content Content.
     */
    const updateBlockContent = (block, content) => {
      if (null === block) {
        return;
      }

      dispatch('core/block-editor').updateBlockAttributes(block.clientId, {
        content,
      });
    };
  
    return (
      <PanelBody title='User Meta Options' initialOpen={true}>
        {selectedBlock ? (
          <>
            <PanelRow>
              <SelectControl
                label={__('Select user meta key:', 'ea-plugins')}
                value={
                  selectedUserMetaKey
                    ? selectedUserMetaKey
                    : __('No user meta found!', 'ea-plugins')
                }
                onChange={(key) => setUserMetaKey(key)}
                options={userMetaKeyOptions()}
              />
            </PanelRow>
            {selectedUserMetaKey && (
              <PanelRow>
                <SelectControl
                  label={__('Select value:', 'ea-plugins')}
                  value={selectedUserMetaValue}
                  onChange={(value) => setUserMetaValue(value)}
                  options={userMetaValueOptions()}
                />
              </PanelRow>
            )}
  
            <PanelRow>
              <Button
                isSecondary
                onClick={() =>
                  updateBlockContent(selectedBlock, selectedUserMetaValue)
                }
              >
                {selectedBlock
                  ? `Update ${selectedBlock.name} block`
                  : 'No block selected'}
              </Button>
            </PanelRow>
          </>
        ) : (
          <PanelRow>{__('Please select a block', 'ea-plugins')}</PanelRow>
        )}
      </PanelBody>
    );
  };
  
  export default UserMetaOptions;
   