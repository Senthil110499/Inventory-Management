-- Truncate Category and cascade to all dependent tables (Inventory, OrderItem, BillItem)
TRUNCATE TABLE "Category" CASCADE;

-- Drop the foreign key constraint on Inventory
ALTER TABLE "Inventory" DROP CONSTRAINT "Inventory_categoryId_fkey";

-- Drop the old integer sequence default from Category.id
ALTER TABLE "Category" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE IF EXISTS "Category_id_seq";

-- Change Category.id from Int to UUID string
ALTER TABLE "Category" ALTER COLUMN "id" TYPE TEXT USING gen_random_uuid()::text;
ALTER TABLE "Category" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()::text;

-- Change Inventory.categoryId from Int to Text
ALTER TABLE "Inventory" ALTER COLUMN "categoryId" TYPE TEXT USING "categoryId"::text;

-- Re-add the foreign key constraint
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_categoryId_fkey"
  FOREIGN KEY ("categoryId") REFERENCES "Category"("id")
  ON UPDATE CASCADE ON DELETE RESTRICT;
