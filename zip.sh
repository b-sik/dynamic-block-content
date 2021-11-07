set -e
#! /bin/bash

echo "" &&
    echo "=======================================================" &&
    echo "*        Build a ZIP for Dynamic Content              *" &&
    echo "*               pls use Bash ^4                       *" &&
    echo "=======================================================" &&
    echo ""

# chmod 775

# Variables
PLUGIN="dynamic-content"
ZIP_FOLDER="_zip"
DONE="\n🎉 done!\n"

#############################################################
# Grab the script from an existing file -or- user input...  #
#                                                           #
# Copyright © 2020 Theodore R. Smith                        #
# License: Creative Commons Attribution v4.0 International  #
# From: https://github.com/hopeseekr/BashScripts/           #
# @see https://stackoverflow.com/a/64486155/430062          #
#############################################################
function getChangelog() {
    if [ ! -z "$1" ] && [ -f "$1" ]; then
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

# Ask and store version
read -r -p "Version: " VERSION

# Make _zip folder
mkdir $ZIP_FOLDER || true

# Define zip path
ZIP_FILE="$PLUGIN-v$VERSION.zip"

# Offer overwrite option if zip version already exists
if [ -f "$ZIP_FOLDER/$ZIP_FILE" ]; then
    while true; do
        echo "$ZIP_FOLDER/$ZIP_FILE already exists. Overwrite? (y/n) "
        read -p "(Note: You will have to manually fixup the changelog.) " yn
        case $yn in
        [Yy]*) break ;;
        [Nn]*) exit ;;
        *) echo "Please answer yes or no." ;;
        esac
    done
fi

# Run the function above to make a changelog list with formatted newlines
CHANGELOG=$(getChangelog "$1")

# Append to top of changelog.txt
echo -e "\n📝 updating changelog..."
echo -e "\n= $VERSION =\n$CHANGELOG\n$(cat changelog.txt)" >changelog.txt
cat changelog.txt
echo -e $DONE

# Run npm build to create new dist files
echo -e "\n⛏  building dist files..."
npm run build
echo -e $DONE

# Make new zip folder and zip file with build dist files
echo -e "\n🧪 creating zip file...\n"
find . -path ./node_modules -prune -o -name "*.php" -print | zip $ZIP_FOLDER/$ZIP_FILE -@
zip -ur $ZIP_FOLDER/$ZIP_FILE assets build changelog.txt constants.json readme.txt readme.md LICENSE
echo -e $DONE

echo -e "\n🤘 $ZIP_FOLDER/$ZIP_FILE created!\n"

# That's all!
