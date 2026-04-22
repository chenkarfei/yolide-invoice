# Security Specification - Yolide Invoice Generator

## Data Invariants
1. A User Profile must be owned by the authenticated user.
2. An Invoice must belong to a User and can only be accessed/modified by that user.
3. Invoices must have valid, strictly typed fields (strings for names, numbers for rates/quantities).
4. `createdAt` and `userId` are immutable after creation.
5. All IDs must match strict regex patterns.

## The Dirty Dozen Payloads (Target: Invoices)

1. **Identity Spoofing**: Attempt to create an invoice for another user's ID.
2. **Orphaned Invoice**: Attempt to create an invoice without a valid user ID in the payload.
3. **Ghost Field Injection**: Adding an `isVerified: true` field to an invoice to bypass future checks.
4. **ID Poisoning**: Using a 2KB string as an `invoiceId`.
5. **Type Mismatch (Tax)**: Sending `taxRate: "10%"` (string) instead of a number.
6. **Negative Value**: Sending `unitPrice: -100`.
7. **Massive Array**: Sending 5000 items in the `items` list to cause resource exhaustion.
8. **Statue Skipping**: Attempting to set an immutable `createdAt` during an update.
9. **PII Leak**: An authenticated user attempting deleted/read another user's invoice.
10. **Terminal State Break**: (Not applicable yet, but planned for "Published" status).
11. **Shadow Update**: Updating `userId` to transfer ownership.
12. **Timestamp Fraud**: Sending a `updatedAt` from 2020 instead of the current server time.

## Verification
The generated `firestore.rules` must block all the above payloads while allowing legitimate business operations.
