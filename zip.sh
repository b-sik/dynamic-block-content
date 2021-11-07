
#! /bin/bash
set -e

echo "" &&
echo "=======================================================" &&
echo "*        Build a ZIP for Dynamic Content              *" &&
echo "*               pls use Bash ^4                       *" &&
echo "=======================================================" &&
echo "" &&

# chmod 775

#Ask & Store Version
read -r -p "Version Number: " VERSION

# VARIABLES
PLUGIN="dynamic-content"
ZIP_FOLDER="_zip"
DONE="🎉 done!\n"

#############################################################
# Grab the script from an existing file -or- user input...  #
#                                                           #
# Copyright © 2020 Theodore R. Smith                        #
# License: Creative Commons Attribution v4.0 International  #
# From: https://github.com/hopeseekr/BashScripts/           #
# @see https://stackoverflow.com/a/64486155/430062          #
#############################################################
function getChangelog()
{
    if [ ! -z "$1" ] &&  [ -f "$1" ]; then
        echo $(<"$1")
    else
        echo "" >&2
        echo "Enter changelog items: (Press CTRL+D when finished.)" >&2
        echo "" >&2

        # Read user input until CTRL+D.
        # @see https://stackoverflow.com/a/38811806/430062
        readarray -t user_input

        # Output as a newline-dilemeted string.
        # @see https://stackoverflow.com/a/15692004/430062
        printf '* %s\n' "${user_input[@]}"
    fi
}

CHANGELOG=$(getChangelog "$1")

echo "\n📝 updating changelog..."
echo -e "\n= $VERSION =\n$CHANGELOG\n$(cat changelog.txt)" > changelog.txt
cat changelog.txt
echo -e $DONE

# Run npm build to create new dist files 
echo "⛏  building dist files..."
npm run build
echo -e $DONE

# make new zip folder and zip file with build dist files
echo "🧪 creating zip file..."
mkdir $ZIP_FOLDER
ZIP_FILE="$PLUGIN-v$VERSION.zip"
find . -path ./node_modules -prune -o -name "*.php" -print | zip $ZIP_FOLDER/$ZIP_FILE -@
zip -ur $ZIP_FOLDER/$ZIP_FILE assets build changelog.txt constants.json readme.txt readme.md LICENSE
echo -e $DONE

echo "🤘 $ZIP_FOLDER/$ZIP_FILE created!"

# that's all!
