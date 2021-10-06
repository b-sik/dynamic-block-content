import { PluginSidebar, PluginSidebarMoreMenuItem } from '@wordpress/edit-post';
import { __ } from '@wordpress/i18n';
import PostMetaOptions from './PostMetaOptions.jsx';
import UserMetaOptions from './UserMetaOptions.jsx';

/**
 * Main plugin component.
 */
const DynamicContentPlugin = () => {
  return (
    <>
      <PluginSidebarMoreMenuItem target='bszyk-dynamic-content'>
        {__('Dynamic Content', 'ea-plugins')}
      </PluginSidebarMoreMenuItem>
      <PluginSidebar
        name='bszyk-dynamic-content'
        title={__('Dynamic Content', 'ea-plugins')}
      >
        <PostMetaOptions />
        {/* <UserMetaOptions /> */}
      </PluginSidebar>
    </>
  );
};

export default DynamicContentPlugin;
