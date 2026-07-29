import { useState } from "react";
import { Mail, MailOpen, Building2, Eye } from "lucide-react";
import { api, formatDateTime } from "@/lib/api";
import { useStore } from "@/context/StoreContext";
import {
  Async, Card, Table, Td, EmptyRow, Modal, Pill, DetailRow, leadStatusStyles, useApi,
} from "./shared.jsx";

const LEAD_STATUSES = ["New", "Contacted", "Quoted", "Closed"];

/* ---------- bulk enquiries ---------- */

export function AdminBulkOrders() {
  const { toast, reportError } = useStore();
  const leads = useApi(() => api.admin.bulkOrders(), []);
  const [viewing, setViewing] = useState(null);

  const list = leads.data || [];

  const setStatus = async (lead, status) => {
    try {
      await api.admin.setBulkOrderStatus(lead.id, status);
      toast(`${lead.name} → ${status}`);
      leads.reload();
    } catch (err) {
      reportError(err, "Could not update the enquiry.");
    }
  };

  return (
    <>
      <Card
        title="Bulk enquiries"
        subtitle={`${list.length} B2B requests · ${list.filter((l) => l.status === "New").length} new`}
      >
        <Async loading={leads.loading} error={leads.error} onRetry={leads.reload} label="Loading enquiries…">
          <Table head={["Contact", "Company", "Product", "Qty", "Received", "Status", ""]} minWidth={900}>
            {list.map((l) => (
              <tr key={l.id} className="border-t border-border align-top">
                <Td>
                  <p className="font-medium">{l.name}</p>
                  <p className="text-xs text-muted-foreground">{l.email}</p>
                  <p className="text-xs text-muted-foreground">{l.phone}</p>
                </Td>
                <Td>
                  <p className="text-sm">{l.company || "—"}</p>
                  {l.gstNumber && (
                    <p className="text-xs text-muted-foreground">GST {l.gstNumber}</p>
                  )}
                </Td>
                <Td className="text-sm text-muted-foreground">{l.productId || "Mixed / custom"}</Td>
                <Td>{l.quantity ?? "—"}</Td>
                <Td className="whitespace-nowrap text-xs text-muted-foreground">
                  {formatDateTime(l.createdAt)}
                </Td>
                <Td>
                  <select
                    value={l.status}
                    onChange={(e) => setStatus(l, e.target.value)}
                    className={`rounded-full border-0 px-2.5 py-1 text-xs font-semibold outline-none ${
                      leadStatusStyles[l.status] || "bg-muted text-muted-foreground"
                    }`}
                  >
                    {LEAD_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </Td>
                <Td>
                  <button
                    onClick={() => setViewing(l)}
                    className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-primary"
                    aria-label={`View enquiry from ${l.name}`}
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </Td>
              </tr>
            ))}
            {list.length === 0 && <EmptyRow colSpan={7}>No bulk enquiries yet.</EmptyRow>}
          </Table>
        </Async>
      </Card>

      {viewing && (
        <Modal
          title={viewing.name}
          subtitle={`${viewing.company || "No company"} · ${formatDateTime(viewing.createdAt)}`}
          onClose={() => setViewing(null)}
        >
          <div className="rounded-xl bg-secondary/50 p-4">
            <DetailRow label="Email" value={<a href={`mailto:${viewing.email}`} className="text-primary hover:underline">{viewing.email}</a>} />
            <DetailRow label="Phone" value={<a href={`tel:${viewing.phone}`} className="text-primary hover:underline">{viewing.phone}</a>} />
            <DetailRow label="GST" value={viewing.gstNumber} />
            <DetailRow label="Product" value={viewing.productId} />
            <DetailRow label="Quantity" value={viewing.quantity} />
            <DetailRow label="Status" value={<Pill value={viewing.status} styles={leadStatusStyles} />} />
          </div>
          <div className="mt-4">
            <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              <Building2 className="h-4 w-4" /> Requirements
            </h3>
            <p className="mt-2 whitespace-pre-wrap rounded-xl border border-border p-4 text-sm leading-relaxed">
              {viewing.requirements || "No details provided."}
            </p>
          </div>
          <a href={`mailto:${viewing.email}?subject=Your Daily Pans bulk enquiry`} className="btn-primary mt-6 w-full">
            <Mail className="h-4 w-4" /> Reply by email
          </a>
        </Modal>
      )}
    </>
  );
}

/* ---------- contact messages ---------- */

export function AdminMessages() {
  const { toast, reportError } = useStore();
  const messages = useApi(() => api.admin.messages(), []);
  const [viewing, setViewing] = useState(null);

  const list = messages.data || [];
  const unread = list.filter((m) => !m.isRead).length;

  const toggleRead = async (msg, isRead) => {
    try {
      await api.admin.markMessageRead(msg.id, isRead);
      toast(isRead ? "Marked as read" : "Marked as unread");
      messages.reload();
    } catch (err) {
      reportError(err, "Could not update the message.");
    }
  };

  const open = (msg) => {
    setViewing(msg);
    if (!msg.isRead) toggleRead(msg, true);
  };

  return (
    <>
      <Card title="Messages" subtitle={`${list.length} messages · ${unread} unread`}>
        <Async loading={messages.loading} error={messages.error} onRetry={messages.reload} label="Loading messages…">
          <Table head={["From", "Subject", "Received", "", ""]} minWidth={760}>
            {list.map((m) => (
              <tr key={m.id} className={`border-t border-border ${m.isRead ? "" : "bg-primary/5"}`}>
                <Td>
                  <p className={m.isRead ? "font-medium" : "font-bold"}>{m.name}</p>
                  <p className="text-xs text-muted-foreground">{m.email}</p>
                </Td>
                <Td>
                  <p className={`text-sm ${m.isRead ? "" : "font-semibold"}`}>
                    {m.subject || "(no subject)"}
                  </p>
                  <p className="line-clamp-1 max-w-sm text-xs text-muted-foreground">{m.message}</p>
                </Td>
                <Td className="whitespace-nowrap text-xs text-muted-foreground">
                  {formatDateTime(m.createdAt)}
                </Td>
                <Td>
                  <button
                    onClick={() => toggleRead(m, !m.isRead)}
                    className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-primary"
                    aria-label={m.isRead ? "Mark unread" : "Mark read"}
                    title={m.isRead ? "Mark unread" : "Mark read"}
                  >
                    {m.isRead ? <MailOpen className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
                  </button>
                </Td>
                <Td>
                  <button
                    onClick={() => open(m)}
                    className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-primary"
                    aria-label={`Read message from ${m.name}`}
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </Td>
              </tr>
            ))}
            {list.length === 0 && <EmptyRow colSpan={5}>No messages yet.</EmptyRow>}
          </Table>
        </Async>
      </Card>

      {viewing && (
        <Modal
          title={viewing.subject || "(no subject)"}
          subtitle={`${viewing.name} · ${formatDateTime(viewing.createdAt)}`}
          onClose={() => setViewing(null)}
        >
          <div className="rounded-xl bg-secondary/50 p-4">
            <DetailRow label="Email" value={<a href={`mailto:${viewing.email}`} className="text-primary hover:underline">{viewing.email}</a>} />
            <DetailRow label="Phone" value={viewing.phone} />
          </div>
          <p className="mt-4 whitespace-pre-wrap rounded-xl border border-border p-4 text-sm leading-relaxed">
            {viewing.message}
          </p>
          <a
            href={`mailto:${viewing.email}?subject=Re: ${encodeURIComponent(viewing.subject || "Your message to Daily Pans")}`}
            className="btn-primary mt-6 w-full"
          >
            <Mail className="h-4 w-4" /> Reply by email
          </a>
        </Modal>
      )}
    </>
  );
}
