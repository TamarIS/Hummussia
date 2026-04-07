# Hummussia


## reference docs to be used in Navotsh gmail account 
menu doc 
https://docs.google.com/spreadsheets/d/14wHNDT2fRhBWqVR5Dt3uuS4KV9oqo91rH1zL9YgBP8c/edit?usp=sharing

## food cost docs: 
drive link: https://drive.google.com/drive/folders/1_xguiF88R4hYsvIPB2CfAoDHbsF6infQ


base ingredients: 

prepared ingredients
https://docs.google.com/spreadsheets/d/1zxBCjCuqxisTWGc2CaaIdKkmAY_Nu7gj_ZMN-BXY6C8/edit?usp=sharing

dishes
https://docs.google.com/spreadsheets/d/1oAH3tPOpUPsL9JaK23W8pgHA_67J87tPrP_SFpK6a9k/edit?usp=drive_link 

## Deployment

Site is hosted on Hostinger at **www.hummussia.com** (Frankfurt datacenter, Premium plan).

### Deploy to production

1. Commit and push your changes to `main`
2. Create a zip archive of the site files (excluding git/config files):
   ```bash
   cd /Users/shelach/tamar/code
   zip -r hummussia_$(date +%Y%m%d_%H%M%S).zip hummussia \
     -x "hummussia/.git/*" "hummussia/.gitignore" \
     -x "hummussia/README.md" "hummussia/next-steps.md" \
     -x "hummussia/.DS_Store" "hummussia/.mcp*" \
     -x "hummussia/mcp-install.sh" "hummussia/.claude/*" "hummussia/claude.md"
   ```
3. Deploy via the Hostinger MCP tool (Claude Code):
   - Domain: `hummussia.com`
   - Order ID: `1009011774`
   - Datacenter: `frankfurt`

### Hostinger account details
- Domain: `hummussia.com` (active, expires 2029-03-24)
- Domain: `hummussia.de` (active, expires 2027-04-30)
- Hosting plan: `hostinger_premium_v3` (order `1009011774`)
