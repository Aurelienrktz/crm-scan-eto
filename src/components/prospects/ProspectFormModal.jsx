import { useState } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { dateInputClass, inputClass, labelClass } from "../ui/formStyles";
import { useToast } from "../../hooks/useToast";
import { STATUS_OPTIONS } from "../../utils/statusConfig";
import {
  DEFAULT_FOLLOW_UP_DAYS,
  buildProspectPayload,
  getProspectFormValues,
  validateProspectForm,
} from "../../utils/prospects";
import { todayISODate } from "../../utils/date";
import { ClientContractFields } from "../clients/ClientContractFields";

export function ProspectFormModal({ prospect, onSave, onClose, asClient = false }) {
  const isEditing = Boolean(prospect);
  const isNewClient = !isEditing && asClient;
  const [form, setForm] = useState(() => getProspectFormValues(prospect, { asClient }));
  const [error, setError] = useState("");
  const toast = useToast();

  function handleChange(field) {
    return (event) => {
      const value = event.target.value;
      setForm((prev) => {
        const next = { ...prev, [field]: value };
        // Becoming a client: start the subscription today unless already set.
        if (field === "status" && value === "client" && !prev.subscription_start) {
          next.subscription_start = todayISODate();
        }
        return next;
      });
    };
  }

  function handleSubmit(event) {
    event.preventDefault();

    const validationError = validateProspectForm(form);
    if (validationError) {
      setError(validationError);
      return;
    }

    const payload = buildProspectPayload(form, isEditing);

    // Closes immediately: the list updates optimistically, this call
    // just reconciles with Supabase in the background.
    // A new client leaves the Prospects list, so say where it went.
    const becameClient = isEditing && prospect.status !== "client" && form.status === "client";
    const messages = becameClient
      ? {
          ok: `« ${payload.name} » est maintenant client : retrouvez-le dans la page Clients`,
          ko: "Les modifications n'ont pas pu être enregistrées.",
        }
      : isEditing
      ? { ok: "Modifications enregistrées", ko: "Les modifications n'ont pas pu être enregistrées." }
      : isNewClient
        ? { ok: "Client ajouté", ko: "Le client n'a pas pu être ajouté." }
        : { ok: "Prospect ajouté", ko: "Le prospect n'a pas pu être ajouté." };

    onSave(payload)
      .then(() => toast.success(messages.ok))
      .catch((err) => {
        console.error("Failed to save prospect", err);
        toast.error(messages.ko);
      });
    onClose();
  }

  const title = isEditing
    ? "Modifier le prospect"
    : isNewClient
      ? "Ajouter un client"
      : "Ajouter un prospect";

  return (
    <Modal
      title={title}
      onClose={onClose}
      className="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className={labelClass}>
            Nom de l'établissement *
          </label>
          <input
            id="name"
            required
            value={form.name}
            onChange={handleChange("name")}
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="min-w-0">
            <label htmlFor="city" className={labelClass}>
              Ville
            </label>
            <input
              id="city"
              value={form.city}
              onChange={handleChange("city")}
              className={inputClass}
            />
          </div>
          <div className="min-w-0">
            <label htmlFor="contact" className={labelClass}>
              Contact
            </label>
            <input
              id="contact"
              value={form.contact}
              onChange={handleChange("contact")}
              placeholder="Téléphone, email, lien..."
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:gap-4">
          <div>
            <label htmlFor="last_contact" className={labelClass}>
              Dernier contact
            </label>
            <input
              id="last_contact"
              type="date"
              value={form.last_contact}
              onChange={handleChange("last_contact")}
              className={dateInputClass}
            />
          </div>
          {!isNewClient && (
            <div>
              <label htmlFor="next_follow_up" className={labelClass}>
                Prochaine relance{form.status === "follow_up" ? " *" : ""}
              </label>
              <input
                id="next_follow_up"
                type="date"
                value={form.next_follow_up}
                onChange={handleChange("next_follow_up")}
                className={dateInputClass}
              />
            </div>
          )}
        </div>

        {!isEditing && !isNewClient && (
          <p className="-mt-2 text-xs text-slate-500 dark:text-slate-400">
            Pré-rempli : contacté aujourd'hui, relance dans{" "}
            {DEFAULT_FOLLOW_UP_DAYS} jours. Modifiable.
          </p>
        )}

        {isEditing && (
          <div>
            <label htmlFor="status" className={labelClass}>
              Statut
            </label>
            <select
              id="status"
              value={form.status}
              onChange={handleChange("status")}
              className={inputClass}
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {form.status === "follow_up" && (
              <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                Une date de prochaine relance est obligatoire pour ce statut.
              </p>
            )}
          </div>
        )}

        {form.status === "client" && (
          <ClientContractFields form={form} onChange={handleChange} />
        )}

        <div>
          <label htmlFor="note" className={labelClass}>
            Note
          </label>
          <textarea
            id="note"
            rows={3}
            value={form.note}
            onChange={handleChange("note")}
            className={inputClass}
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit">
            {isEditing ? "Enregistrer" : isNewClient ? "Ajouter le client" : "Ajouter le prospect"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
