
echo "" &&
echo "======================================================" &&
echo "Build a ZIP for Dynamic Content" &&
echo "======================================================" &&
echo "" &&
#! /bin/bash

# chmod 775

#Ask & Store Version
read -r -p "Version Number: " VERSION

# VARIABLES
PLUGIN="dynamic-content"
ZIP_FOLDER="_zip"
DONE="🎉 done!\n"

read -p "Changelog: " CHANGELOG
# Add to changelog
echo "\n📝 updating changelog..."
echo "\n= $VERSION =\n* $CHANGELOG" >> changelog.txt
echo "$DONE"

# Run npm build to create new dist files 
echo "⛏  building dist files..."
npm run build
echo "$DONE"

# delete zip folder and all of it's contents
if [ -d "$ZIP_FOLDER" ]
then
echo "🪚  removing existing zip folder..."
rm -r $ZIP_FOLDER
echo "$DONE"
fi

# make new zip folder and zip file with build dist files
echo "🧪 creating zip file..."
mkdir $ZIP_FOLDER
ZIP_FILE="$PLUGIN.zip"
find . -path ./node_modules -prune -o -name "*.php" -print | zip $ZIP_FOLDER/$ZIP_FILE -@
zip -ur $ZIP_FOLDER/$ZIP_FILE build changelog.txt constants.json readme.txt readme.md
echo "$DONE"

echo "🤘 $ZIP_FOLDER/$ZIP_FILE created!"

# that's all!
